export class DeploymentService {
  async deployToVercel(
    files: Map<string, string>,
    token: string,
    projectName: string
  ): Promise<{ url: string; deploymentId: string }> {
    const formData = new FormData();
    
    // Add files to form data
    for (const [path, content] of files) {
      const blob = new Blob([content], { type: 'text/html' });
      formData.append('file', blob, path);
    }
    
    try {
      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Deployment failed: ${error}`);
      }
      
      const result = await response.json();
      
      return {
        url: `https://${result.url}`,
        deploymentId: result.id
      };
      
    } catch (error) {
      console.error('Vercel deployment error:', error);
      throw error;
    }
  }
  
  async checkDeploymentStatus(deploymentId: string, token: string): Promise<string> {
    const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    const data = await response.json();
    return data.readyState; // QUEUED, BUILDING, READY, ERROR
  }
}

export const deploymentService = new DeploymentService();