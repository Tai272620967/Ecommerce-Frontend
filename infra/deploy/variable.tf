variable "prefix" {
  description = "Prefix for resources in AWS"
  default     = "muji-front"
}

variable "project" {
  description = "Project name for tagging resources"
  default     = "muji-app-front"
}

variable "contact" {
  description = "Contact email for tagging resources"
  default     = "tai272620967@gmail.com"
}

# variable "db_username" {
#   description = "Username for the muji app api database"
#   default     = "root"
# }

# variable "db_password" {
#   description = "Password for the Terraform database"
# }

variable "ecr_proxy_image" {
  description = "Path to the ECR repo with the proxy image"
}

variable "ecr_front_image" {
  description = "Path to the ECR repo with the API image"
}
