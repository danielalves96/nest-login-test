import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Testa o servidor' })
  healthCheck() {
    const data = {
      uptime: process.uptime(),
      responsetime: process.hrtime(),
      message: 'OK',
      timestamp: Date.now(),
    };
    try {
      return data;
    } catch (error) {
      throw new ServiceUnavailableException(
        'Service Unavailable',
        error.message,
      );
    }
  }
}
