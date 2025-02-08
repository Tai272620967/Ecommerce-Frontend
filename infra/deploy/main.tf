terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.23.0"
    }
  }

  backend "s3" {
    bucket               = "muji-front-tf-state"
    key                  = "tf-state-deploy"
    workspace_key_prefix = "tf-state-deploy-env"
    region               = "ap-southeast-1"
    encrypt              = true
    dynamodb_table       = "muji-front-tf-lock"
  }
}

provider "aws" {
  region = "ap-southeast-1"
  default_tags {
    tags = {
      Environment = terraform.workspace
      Project     = var.project
      Contact     = var.contact
      ManageBy    = "Terraform/deploy"
    }
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
}

data "aws_region" "current" {}

data "terraform_remote_state" "be" {
  backend = "s3"

  config = {
    bucket = "muji-app-tf-state"
    key    = "tf-state-deploy-env/${terraform.workspace}/tf-state-deploy"
    region = "ap-southeast-1"
  }
}




