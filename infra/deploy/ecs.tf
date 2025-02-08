##
# ECS Cluster for running app on Fargate.
##

##
# Tạo IAM Role cho ECS Task Execution để ECS có thể lấy image từ ECR và ghi logs.
##
resource "aws_iam_policy" "task_execution_role_policy" {
  name        = "${local.prefix}-task-exec-role-policy"
  path        = "/"
  description = "Allow ECS to retrieve images and add to logs."
  policy      = file("./templates/ecs/task-execution-role-policy.json")
}

resource "aws_iam_role" "task_execution_role" {
  name               = "${local.prefix}-task-execution-role"
  assume_role_policy = file("./templates/ecs/task-assume-role-policy.json")
}

resource "aws_iam_role_policy_attachment" "task_execution_role" {
  role       = aws_iam_role.task_execution_role.name
  policy_arn = aws_iam_policy.task_execution_role_policy.arn
}

##
# Tạo IAM Role cho ứng dụng trong ECS Task để có thể dùng AWS Systems Manager (SSM).
##

resource "aws_iam_role" "app_task" {
  name               = "${local.prefix}-app-task"
  assume_role_policy = file("./templates/ecs/task-assume-role-policy.json")
}

resource "aws_iam_policy" "task_ssm_policy" {
  name        = "${local.prefix}-task-ssm-role-policy"
  path        = "/"
  description = "Policy to allow System Manager to execute in container"
  policy      = file("./templates/ecs/task-ssm-policy.json")
}

resource "aws_iam_role_policy_attachment" "task_ssm_policy" {
  role       = aws_iam_role.app_task.name
  policy_arn = aws_iam_policy.task_ssm_policy.arn
}

##
# Tạo CloudWatch Log Group để lưu logs từ ECS Task.
##

resource "aws_cloudwatch_log_group" "ecs_task_logs" {
  name = "${local.prefix}-api"
}

##
# Tạo ECS Cluster để chạy ứng dụng trên Fargate.
##

resource "aws_ecs_cluster" "main" {
  name = "${local.prefix}-cluster"
}

resource "aws_cloudwatch_log_group" "ecs_front_logs" {
  name = "${local.prefix}-front"
}

resource "aws_cloudwatch_log_group" "ecs_proxy_logs" {
  name = "${local.prefix}-proxy"
}

resource "aws_ecs_task_definition" "front" {
  family                   = "${local.prefix}-front"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 1024
  execution_role_arn       = aws_iam_role.task_execution_role.arn
  task_role_arn            = aws_iam_role.app_task.arn

  container_definitions = jsonencode(
    [
      {
        name              = "front"
        image             = var.ecr_front_image
        essential         = true
        memoryReservation = 256
        environment = [
          {
            name = "PORT"
            value = "3000"
          },
          {
            name = "NEXT_PUBLIC_API_BASE_URL"
            value = "http://3.0.184.170:8080/api/v1"
          },
          {
            name = "NEXT_PUBLIC_API_BASE_URI"
            value = "http://3.0.184.170:8080/storage"
          },
          {
            name  = "ALLOWED_HOSTS"
            value = "*"
          }
        ]
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-group         = aws_cloudwatch_log_group.ecs_front_logs.name
            awslogs-region        = data.aws_region.current.name
            awslogs-stream-prefix = "front"
          }
        }
      }
    ]
  )

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
}

resource "aws_ecs_task_definition" "proxy" {
  family                   = "${local.prefix}-proxy"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.task_execution_role.arn
  task_role_arn            = aws_iam_role.app_task.arn

  container_definitions = jsonencode(
    [
      {
        name              = "proxy"
        image             = var.ecr_proxy_image
        essential         = true
        memoryReservation = 256
        portMappings = [
          {
            containerPort = 80
            hostPort      = 80
          }
        ]
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-group         = aws_cloudwatch_log_group.ecs_proxy_logs.name
            awslogs-region        = data.aws_region.current.name
            awslogs-stream-prefix = "proxy"
          }
        }
      }
    ]
  )

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
}

resource "aws_security_group" "ecs_front_service" {
  description = "Access rules for the ECS front service."
  name        = "${local.prefix}-ecs-front-service"
  vpc_id      = data.terraform_remote_state.be.outputs.vpc_id

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs_proxy_service" {
  description = "Access rules for the ECS proxy service."
  name        = "${local.prefix}-ecs-proxy-service"
  vpc_id      = data.terraform_remote_state.be.outputs.vpc_id

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "front" {
  name                   = "${local.prefix}-front"
  cluster                = aws_ecs_cluster.main.name
  task_definition        = aws_ecs_task_definition.front.family
  desired_count          = 1
  launch_type            = "FARGATE"
  platform_version       = "1.4.0"
  enable_execute_command = true

  network_configuration {
    assign_public_ip = true
    subnets          = data.terraform_remote_state.be.outputs.public_subnets
    # subnets = [
    #   aws_subnet.public_a.id,
    #   aws_subnet.public_b.id
    # ]
    # security_groups = [aws_security_group.ecs_front_service.id]
  }
}

resource "aws_ecs_service" "proxy" {
  name                   = "${local.prefix}-proxy"
  cluster                = aws_ecs_cluster.main.name
  task_definition        = aws_ecs_task_definition.proxy.family
  desired_count          = 1
  launch_type            = "FARGATE"
  platform_version       = "1.4.0"
  enable_execute_command = true

  network_configuration {
    assign_public_ip = true
    subnets          = data.terraform_remote_state.be.outputs.public_subnets
    # subnets = [
    #   aws_subnet.public_a.id,
    #   aws_subnet.public_b.id
    # ]
    security_groups = [aws_security_group.ecs_proxy_service.id]
  }
}
