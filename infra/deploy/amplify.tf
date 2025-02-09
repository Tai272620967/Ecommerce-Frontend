provider "aws" {
  region = "ap-southeast-1" # Chỉnh theo region của bạn
}

# IAM Role cho Amplify
resource "aws_iam_role" "amplify_role" {
  name = "AmplifyServiceRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "amplify.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

# Amplify App
resource "aws_amplify_app" "fe_app" {
  name          = "muji-fe"
  repository    = "https://gitlab.com/demo373147/muji-frontend-aws-cicd.git" # Thay bằng GitLab repo của bạn
  platform      = "WEB"
  iam_service_role_arn = aws_iam_role.amplify_role.arn

  enable_branch_auto_build = true
  enable_branch_auto_deletion = true
  build_spec = file("${path.module}/amplify-buildspec.yml")

  environment_variables = {
    NODE_VERSION = "18"
    NEXT_PUBLIC_API_URL = "https://api.example.com" # Thay bằng API backend của bạn
  }
}

# Tạo branch chính (main)
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.fe_app.id
  branch_name = "main"

  # Cấu hình auto build cho branch main
  enable_auto_build = true
}

# Tạo branch dev (nếu cần)
resource "aws_amplify_branch" "dev" {
  app_id      = aws_amplify_app.fe_app.id
  branch_name = "dev"

  # Cấu hình auto build cho branch dev
  enable_auto_build = true
}
