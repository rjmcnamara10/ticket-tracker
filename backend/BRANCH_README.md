## Steps to deploy Lambdas with AWS SAM:

1. Go to backend directory: `cd backend`
2. Sign in to aws with necessary credentials: `aws sso login --profile admin`
3. Generate dist folder with nested folder for each lambda: `npm run build`
4. Generate .aws-sam folder for deployment with AWS SAM: `sam build --template-file aws-sam-lambdas.yaml`
5. Deploy CloudFormation stack/Lambdas to AWS: `sam deploy --guided --profile admin --parameter-overrides MongoDbUri="<insert env variable value>"`, use stack name 'ticket-track-backend'


## Instructions for how to add a new lambda

1. Follow an existing example to write code for lambda in `backend/lambdas/…/….ts`
2. Add lambda to `backend/build.js`
3. Add lambda to `backend/aws-sam-lambdas.yaml`
