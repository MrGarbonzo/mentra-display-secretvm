import { AppServer, AppSession, ViewType } from '@mentra/sdk';

const PACKAGE_NAME = process.env.PACKAGE_NAME || 'com.example.displayapp';
const MENTRAOS_API_KEY = process.env.MENTRAOS_API_KEY || 'simulator-mode';
const PORT = parseInt(process.env.PORT || '3000');
const SIMULATOR_URL = process.env.SIMULATOR_URL || 'ws://localhost:3001';
const PAIRING_CODE = process.env.PAIRING_CODE || process.argv[2] || '000000';

class ExampleMentraOSApp extends AppServer {

  constructor() {
    super({
      packageName: PACKAGE_NAME,
      apiKey: MENTRAOS_API_KEY,
      port: PORT,
      simulator: {
        enabled: true,
        url: SIMULATOR_URL,
        code: PAIRING_CODE,
      },
    });
  }

  protected async onSession(session: AppSession, sessionId: string, userId: string): Promise<void> {
    session.logger.info('Display Example App started!');
    
    // Show welcome message
    session.layouts.showTextWall("Display Example App is ready!");

    // Wait 2 seconds
    await this.sleep(2000);

    // Test TextWall
    session.logger.info('Testing TextWall layout...');
    session.layouts.showTextWall("This is a TextWall layout", {
      view: ViewType.MAIN,
      durationMs: 3000
    });

    await this.sleep(3500);

    // Test DoubleTextWall
    session.logger.info('Testing DoubleTextWall layout...');
    session.layouts.showDoubleTextWall(
      "Top Section",
      "Bottom Section",
      {
        view: ViewType.MAIN,
        durationMs: 3000
      }
    );

    await this.sleep(3500);

    // Test ReferenceCard
    session.logger.info('Testing ReferenceCard layout...');
    session.layouts.showReferenceCard(
      "Reference Card",
      "Line 1\nLine 2\nLine 3\n\nThis supports multi-line content!",
      {
        view: ViewType.MAIN,
        durationMs: 5000
      }
    );

    await this.sleep(5500);

    // Test DashboardCard
    session.logger.info('Testing DashboardCard layout...');
    session.layouts.showDashboardCard(
      "Status",
      "Connected ✓",
      {
        view: ViewType.DASHBOARD
      }
    );

    await this.sleep(2000);

    // Test camera if model supports it
    try {
      session.logger.info('Testing camera photo capture...');
      session.layouts.showTextWall("Requesting photo...");
      
      const photo = await session.camera.requestPhoto({ saveToGallery: false });
      
      session.logger.info(`Photo received: ${photo.size} bytes, ${photo.mimeType}`);
      
      session.layouts.showReferenceCard(
        "Photo Captured!",
        `Size: ${photo.size} bytes\nType: ${photo.mimeType}\n\nPhoto successfully captured from simulator.`,
        {
          view: ViewType.MAIN,
          durationMs: 5000
        }
      );

      await this.sleep(5500);
    } catch (error: any) {
      session.logger.warn('Camera not available or request failed', { error: error.message });
      session.layouts.showTextWall("Camera not available on this model");
      await this.sleep(3000);
    }

    // Show final status
    session.layouts.showTextWall("All tests complete! Listening for events...");

    // Handle real-time transcription
    session.events.onTranscription((data) => {
      session.logger.info('Transcription received', { 
        text: data.text, 
        isFinal: data.isFinal,
        language: data.language 
      });
      
      if (data.isFinal) {
        session.layouts.showTextWall("You said: " + data.text, {
          view: ViewType.MAIN,
          durationMs: 3000
        });
      }
    });

    session.events.onGlassesBattery((data) => {
      session.logger.info('Glasses battery update', { level: data.level, charging: data.charging });
      
      session.layouts.showDashboardCard(
        "Battery",
        `${data.level}%`,
        {
          view: ViewType.DASHBOARD
        }
      );
    });

    session.logger.info('='.repeat(50));
    session.logger.info('Display Example App fully initialized!');
    session.logger.info('Now listening for events.');
    session.logger.info('='.repeat(50));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Start the server
const app = new ExampleMentraOSApp();
app.start().catch(console.error);

console.log('='.repeat(50));
console.log('Display Example App starting...');
console.log('Pairing code:', PAIRING_CODE);
console.log('Simulator URL:', SIMULATOR_URL);
console.log('Make sure simulator is running first!');
console.log('='.repeat(50));
