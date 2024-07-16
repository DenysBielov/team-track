import json
from fastapi import Request, Response
from humps import camelize
from starlette.middleware.base import BaseHTTPMiddleware

class ConvertResponseMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if response.headers.get('content-type') == 'application/json':
            body = b''
            async for chunk in response.body_iterator:
                body += chunk
            data = json.loads(body)
            
            camel_case_data = camelize(data)

            new_response_body = json.dumps(camel_case_data).encode('utf-8')
            response.headers["Content-Length"] = str(len(new_response_body))
            
            return Response(content=new_response_body, status_code=response.status_code, 
                headers=dict(response.headers), media_type=response.media_type)
        else:
            return response