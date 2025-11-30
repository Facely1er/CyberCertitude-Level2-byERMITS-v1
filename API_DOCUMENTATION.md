# 🔌 API Documentation - CMMC Level 1 Compliance Platform

## Overview

This document provides comprehensive API documentation for the CMMC Level 1 Compliance Platform, including all services, endpoints, and integration patterns.

## Table of Contents

- [Authentication API](#authentication-api)
- [Assessment API](#assessment-api)
- [Evidence Management API](#evidence-management-api)
- [User Management API](#user-management-api)
- [Analytics API](#analytics-api)
- [Workflow API](#workflow-api)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [SDK Usage](#sdk-usage)

---

## Authentication API

### Base URL
```
https://your-api-domain.com/api/v1/auth
```

### Endpoints

#### POST /login
Authenticate user with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "compliance_officer",
      "organization_id": "uuid"
    },
    "tokens": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_in": 3600
    }
  }
}
```

#### POST /register
Register new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "organization_name": "Acme Corp",
  "role": "compliance_officer"
}
```

#### POST /refresh
Refresh access token.

**Request:**
```json
{
  "refresh_token": "refresh_token"
}
```

#### POST /logout
Logout user and invalidate tokens.

**Request:**
```json
{
  "refresh_token": "refresh_token"
}
```

#### POST /mfa/setup
Setup Multi-Factor Authentication.

**Request:**
```json
{
  "method": "totp" // or "email"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qr_code": "data:image/png;base64,...",
    "secret": "MFRGG43UOQ2HKMRX",
    "backup_codes": ["12345678", "87654321"]
  }
}
```

#### POST /mfa/verify
Verify MFA code.

**Request:**
```json
{
  "code": "123456",
  "method": "totp"
}
```

---

## Assessment API

### Base URL
```
https://your-api-domain.com/api/v1/assessments
```

### Endpoints

#### GET /assessments
Get all assessments for the user's organization.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status
- `domain` (optional): Filter by CMMC domain

**Response:**
```json
{
  "success": true,
  "data": {
    "assessments": [
      {
        "id": "uuid",
        "name": "Q1 2024 CMMC Assessment",
        "status": "in_progress",
        "progress_percentage": 65,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-20T14:45:00Z",
        "domain_scores": {
          "AC": 85,
          "AU": 70,
          "AT": 90
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

#### POST /assessments
Create new assessment.

**Request:**
```json
{
  "name": "Q1 2024 CMMC Assessment",
  "description": "Quarterly CMMC Level 1 assessment",
  "framework_version": "2.0",
  "organization_id": "uuid"
}
```

#### GET /assessments/{id}
Get specific assessment details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Q1 2024 CMMC Assessment",
    "status": "in_progress",
    "progress_percentage": 65,
    "controls": [
      {
        "id": "AC.3.1.1",
        "title": "Access Control",
        "status": "implemented",
        "maturity_score": 4,
        "evidence_count": 3,
        "last_updated": "2024-01-20T14:45:00Z"
      }
    ],
    "domain_scores": {
      "AC": 85,
      "AU": 70,
      "AT": 90
    }
  }
}
```

#### PUT /assessments/{id}
Update assessment.

**Request:**
```json
{
  "name": "Updated Assessment Name",
  "status": "completed"
}
```

#### DELETE /assessments/{id}
Delete assessment.

#### GET /assessments/{id}/controls
Get all controls for an assessment.

#### PUT /assessments/{id}/controls/{control_id}
Update control implementation status.

**Request:**
```json
{
  "status": "implemented",
  "maturity_score": 4,
  "notes": "Implementation completed with evidence",
  "evidence_ids": ["uuid1", "uuid2"]
}
```

---

## Evidence Management API

### Base URL
```
https://your-api-domain.com/api/v1/evidence
```

### Endpoints

#### GET /evidence
Get all evidence items.

**Query Parameters:**
- `assessment_id` (optional): Filter by assessment
- `control_id` (optional): Filter by control
- `type` (optional): Filter by evidence type
- `page` (optional): Page number
- `limit` (optional): Items per page

#### POST /evidence
Upload new evidence.

**Request (multipart/form-data):**
```
file: [binary file data]
control_id: "AC.3.1.1"
evidence_type: "policy_document"
title: "Access Control Policy"
description: "Organization's access control policy"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Access Control Policy",
    "file_url": "https://storage.example.com/evidence/uuid.pdf",
    "file_size": 1024000,
    "mime_type": "application/pdf",
    "uploaded_at": "2024-01-20T14:45:00Z"
  }
}
```

#### GET /evidence/{id}
Get specific evidence item.

#### PUT /evidence/{id}
Update evidence metadata.

**Request:**
```json
{
  "title": "Updated Policy Title",
  "description": "Updated description",
  "tags": ["policy", "access-control"]
}
```

#### DELETE /evidence/{id}
Delete evidence item.

#### GET /evidence/{id}/download
Download evidence file.

---

## User Management API

### Base URL
```
https://your-api-domain.com/api/v1/users
```

### Endpoints

#### GET /users
Get all users in organization.

#### POST /users
Create new user.

**Request:**
```json
{
  "email": "newuser@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "domain_expert",
  "permissions": ["read_assessments", "edit_controls"]
}
```

#### GET /users/{id}
Get user details.

#### PUT /users/{id}
Update user.

#### DELETE /users/{id}
Delete user.

#### PUT /users/{id}/role
Update user role.

**Request:**
```json
{
  "role": "compliance_officer",
  "permissions": ["read_assessments", "edit_controls", "manage_users"]
}
```

---

## Analytics API

### Base URL
```
https://your-api-domain.com/api/v1/analytics
```

### Endpoints

#### GET /compliance-dashboard
Get compliance analytics dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "overall_score": 78,
    "domain_scores": {
      "AC": 85,
      "AU": 70,
      "AT": 90,
      "CM": 65
    },
    "trends": {
      "monthly_progress": [
        {"month": "2024-01", "score": 70},
        {"month": "2024-02", "score": 75},
        {"month": "2024-03", "score": 78}
      ]
    },
    "gaps": [
      {
        "control_id": "AC.3.1.2",
        "title": "Account Management",
        "priority": "high",
        "days_to_implement": 14
      }
    ]
  }
}
```

#### GET /user-activity
Get user activity analytics.

#### GET /performance-metrics
Get system performance metrics.

---

## Workflow API

### Base URL
```
https://your-api-domain.com/api/v1/workflows
```

### Endpoints

#### GET /workflows
Get all workflows.

#### POST /workflows
Create new workflow.

#### GET /workflows/{id}
Get workflow details.

#### PUT /workflows/{id}/phases/{phase_id}
Update workflow phase.

#### GET /workflows/{id}/progress
Get workflow progress.

---

## Error Handling

### Error Response Format

All API endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2024-01-20T14:45:00Z",
  "request_id": "req_123456789"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

### Limits

- **Authentication endpoints**: 5 requests per minute
- **Assessment endpoints**: 100 requests per minute
- **Evidence endpoints**: 50 requests per minute
- **Analytics endpoints**: 20 requests per minute

### Headers

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642680000
```

---

## SDK Usage

### JavaScript/TypeScript

```typescript
import { CMMCApiClient } from '@cmmc/api-client';

const client = new CMMCApiClient({
  baseUrl: 'https://your-api-domain.com/api/v1',
  apiKey: 'your-api-key'
});

// Create assessment
const assessment = await client.assessments.create({
  name: 'Q1 2024 Assessment',
  description: 'Quarterly assessment'
});

// Upload evidence
const evidence = await client.evidence.upload({
  file: fileData,
  controlId: 'AC.3.1.1',
  title: 'Access Control Policy'
});
```

### Python

```python
from cmmc_api import CMMCApiClient

client = CMMCApiClient(
    base_url='https://your-api-domain.com/api/v1',
    api_key='your-api-key'
)

# Create assessment
assessment = client.assessments.create({
    'name': 'Q1 2024 Assessment',
    'description': 'Quarterly assessment'
})

# Upload evidence
evidence = client.evidence.upload(
    file_data=file_data,
    control_id='AC.3.1.1',
    title='Access Control Policy'
)
```

---

## Authentication

### API Key Authentication

Include your API key in the Authorization header:

```
Authorization: Bearer your-api-key
```

### JWT Token Authentication

For user-specific operations, include the JWT token:

```
Authorization: Bearer jwt-token
```

---

## Webhooks

### Available Events

- `assessment.created`
- `assessment.updated`
- `assessment.completed`
- `evidence.uploaded`
- `evidence.updated`
- `user.created`
- `user.updated`

### Webhook Payload

```json
{
  "event": "assessment.updated",
  "data": {
    "id": "uuid",
    "name": "Q1 2024 Assessment",
    "status": "completed"
  },
  "timestamp": "2024-01-20T14:45:00Z"
}
```

---

## SDKs and Libraries

### Official SDKs

- **JavaScript/TypeScript**: `@cmmc/api-client`
- **Python**: `cmmc-api-python`
- **Java**: `cmmc-api-java`
- **C#**: `CMMC.ApiClient`

### Community Libraries

- **Go**: `go-cmmc-api`
- **PHP**: `cmmc-api-php`
- **Ruby**: `cmmc-api-ruby`

---

## Support

For API support and questions:

- **Documentation**: [https://docs.cmmc-platform.com](https://docs.cmmc-platform.com)
- **Support Email**: api-support@cmmc-platform.com
- **Status Page**: [https://status.cmmc-platform.com](https://status.cmmc-platform.com)

---

*Last Updated: January 2025*  
*API Version: v1.0.0*