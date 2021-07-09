import * as child_process from 'child_process';
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
    const exec = util.promisify(child_process.exec);
    dotenv.config();
    const { stdout, stderr } = await exec('./saml-new.sh')
    console.log(stdout, stderr);
    
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
    
    console.log(util.inspect(serviceDescriptions, null, 4));
    
    return Promise.resolve();
})();