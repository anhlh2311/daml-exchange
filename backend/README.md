## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## DAML Templates API

This application includes a robust API for fetching DAML templates from the ledger. The implementation uses GraphQL to query the DAML ledger for template information.

### API Endpoints

- `GET /api/templates` - Returns all available DAML templates with their metadata

### Implementation Details

The templates API is implemented using a three-layer architecture:

1. **Controller** (`templates.controller.ts`) - Handles HTTP requests and responses
2. **Service** (`templates.service.ts`) - Contains business logic for fetching templates
3. **Module** (`templates.module.ts`) - Wires everything together

The current implementation uses GraphQL to fetch templates from the DAML ledger. This approach was chosen because:

- It's more reliable and consistent with how the DAML Navigator UI fetches templates
- It provides better performance for template queries
- It includes additional metadata like contract counts

### Using the Utility Scripts

The project includes a utility script (`requests.js`) that demonstrates how to interact with the backend API. To use it:

```bash
# Make sure the backend server is running
$ npm run start

# In another terminal, run the requests script
$ node requests.js
```

The `requests.js` script provides several utility functions:

- `fetchTemplates()` - Fetches all templates from the backend API
- `templatesExample()` - Demonstrates fetching and displaying template information

Example usage in your own code:

```javascript
const { fetchTemplates } = require('./requests');

async function myFunction() {
  try {
    const result = await fetchTemplates();
    console.log(`Found ${result.templates.length} templates`);
    
    // Process templates as needed
    result.templates.forEach(template => {
      console.log(`Template: ${template.templateId}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
