interface EmailTemplate {
    subject: string;
    body: string;
  }
  
export interface EmailTransporter {
    host: string; 
    port: number; 
    user: string; 
    pass: string;
  }
  
export interface Email {
    from: string;
    subject: string;
    body?: string;
    variables?: Record<string,any>;
    bcc?:string|string[];
    cc?:string|string[];
    to: string;
    replyTo?: string;
    headers: {
    //   "Content-Type": string;
    };
    template?: string;
    transporter?: EmailTransporter;
    html?: boolean
  }