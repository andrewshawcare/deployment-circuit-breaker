import * as util from 'util';
import * as dotenv from 'dotenv';
import {
    DescribeServicesCommand, DescribeServicesCommandInput, DescribeServicesCommandOutput,
    ECSClient,
    ListServicesCommand,
    ListServicesCommandInput,
    ListServicesCommandOutput
} from "@aws-sdk/client-ecs";

(async () => {
    dotenv.config();
    
    const ecsClient = new ECSClient({});
    
    const cluster = process.env['CLUSTER_ARN'];
    
    const services = (await ecsClient.send<ListServicesCommandInput, ListServicesCommandOutput>(new ListServicesCommand({
        cluster
    }))).serviceArns;
    
    const serviceDescriptions = await ecsClient.send<DescribeServicesCommandInput, DescribeServicesCommandOutput>(new DescribeServicesCommand({
        cluster,
        services
    }));
    
    // Service: deploymentConfiguration, deployments, events, healthCheckGracePeriodSeconds, desiredCount, pendingCount, runningCount, status, taskDefinition
    
    console.log(util.inspect(serviceDescriptions, undefined, 4));
    
    return Promise.resolve();
})();