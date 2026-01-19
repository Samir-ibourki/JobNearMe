import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'JobNearMe API',
    version: '1.0.0',
    description: 'API Documentation for JobNearMe - A location-based job search application',
    contact: {
      name: 'Samir Ibourki',
      url: 'https://github.com/Samir-ibourki',
    },
  },
  servers: [
    { url: 'http://localhost:3030', description: 'Development' },
    { url: 'https://jobnearme-az.railway.app', description: 'Production' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          fullname: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['candidate', 'employer'] },
          phone: { type: 'string' },
        },
      },
      Job: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string' },
          salary: { type: 'string' },
          category: { type: 'string' },
          city: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          address: { type: 'string' },
          employerId: { type: 'integer' },
        },
      },
      Application: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          status: { type: 'string', enum: ['pending', 'accepted', 'rejected'] },
          coverLetter: { type: 'string' },
          candidateId: { type: 'integer' },
          jobId: { type: 'integer' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullname', 'email', 'password', 'role', 'phone'],
                properties: {
                  fullname: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: 'password123' },
                  role: { type: 'string', enum: ['candidate', 'employer'] },
                  phone: { type: 'string', example: '+212600000000' },
                  city: { type: 'string', example: 'Casablanca' },
                  address: { type: 'string', example: '123 Main St' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Get user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Profile retrieved' },
          401: { description: 'Unauthorized' },
        },
      },
      put: {
        tags: ['Auth'],
        summary: 'Update user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullname: { type: 'string' },
                  phone: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'john@example.com' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Reset email sent' },
          404: { description: 'User not found' },
        },
      },
    },
    '/api/auth/reset-password/{token}': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password',
        parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  password: { type: 'string', example: 'newpassword123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password reset successfully' },
          400: { description: 'Invalid token' },
        },
      },
    },
    '/api/jobs': {
      get: {
        tags: ['Jobs'],
        summary: 'Get all jobs',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'city', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of jobs' },
        },
      },
      post: {
        tags: ['Jobs'],
        summary: 'Create new job',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'city', 'latitude', 'longitude'],
                properties: {
                  title: { type: 'string', example: 'Software Developer' },
                  description: { type: 'string', example: 'Job description...' },
                  salary: { type: 'string', example: '5000-8000 MAD' },
                  category: { type: 'string', example: 'Technology' },
                  city: { type: 'string', example: 'Casablanca' },
                  latitude: { type: 'number', example: 33.5731 },
                  longitude: { type: 'number', example: -7.5898 },
                  address: { type: 'string', example: '123 Tech Street' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Job created' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/jobs/nearby': {
      get: {
        tags: ['Jobs'],
        summary: 'Get nearby jobs',
        parameters: [
          { name: 'latitude', in: 'query', required: true, schema: { type: 'number' } },
          { name: 'longitude', in: 'query', required: true, schema: { type: 'number' } },
          { name: 'radius', in: 'query', schema: { type: 'number', default: 10 } },
        ],
        responses: {
          200: { description: 'List of nearby jobs' },
        },
      },
    },
    '/api/jobs/my-jobs': {
      get: {
        tags: ['Jobs'],
        summary: 'Get employer jobs',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Employer jobs list' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/jobs/stats': {
      get: {
        tags: ['Jobs'],
        summary: 'Get employer statistics',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Statistics data' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/jobs/{id}': {
      get: {
        tags: ['Jobs'],
        summary: 'Get job by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Job details' },
          404: { description: 'Job not found' },
        },
      },
      put: {
        tags: ['Jobs'],
        summary: 'Update job',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Job updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Job not found' },
        },
      },
      delete: {
        tags: ['Jobs'],
        summary: 'Delete job',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Job deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'Job not found' },
        },
      },
    },
    '/api/applications/{jobId}': {
      post: {
        tags: ['Applications'],
        summary: 'Apply to job',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'jobId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  coverLetter: { type: 'string', example: 'I am interested...' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Application submitted' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/applications/my': {
      get: {
        tags: ['Applications'],
        summary: 'Get my applications',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of applications' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/applications/job/{jobId}': {
      get: {
        tags: ['Applications'],
        summary: 'Get job applicants',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'jobId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'List of applicants' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/applications/{applicationId}/status': {
      patch: {
        tags: ['Applications'],
        summary: 'Update application status',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'applicationId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['accepted', 'rejected'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Status updated' },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
};

const swaggerSpec = swaggerDefinition;

export default swaggerSpec;
