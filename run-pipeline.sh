set -e

set -o allexport
source .env
set +o allexport

version="$(git rev-parse HEAD)"

aws cloudformation deploy \
  --no-fail-on-empty-changeset \
  --template-file './ECRRepository.yaml' \
  --stack-name 'DeploymentCircuitBreaker-ECRRepository'

# TODO: Get ECR repository URI
ecr_repository_hostname=''

aws ecr get-login-password \
  --region us-west-2 \
| docker login \
  --username AWS \
  --password-stdin \
  "${ecr_repository_hostname}"

docker build -t deployment-circuit-breaker/application .
docker tag deployment-circuit-breaker/application:latest "${ecr_repository_hostname}/deployment-circuit-breaker/application:${version}"
docker push "${ecr_repository_hostname}/deployment-circuit-breaker/application:${version}"

aws cloudformation deploy \
    --no-fail-on-empty-changeset \
    --template-file './Service.yaml' \
    --stack-name 'DeploymentCircuitBreaker-Service' \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides "Version=${version}"