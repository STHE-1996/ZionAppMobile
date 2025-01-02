// Interface for Social Media Links
export interface SocialMediaLinkModels {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    // Add other social media links as needed
  }
  
  // Interface for Post Model
  export interface Post {
    id: string;
    content: string;
    createdAt: string;
    // Add other post fields as needed
  }
  
  // Interface for Invitation Model
  export interface InvitationModel {
    invitationId: string;
    eventDate: string;
    // Add other invitation fields as needed
  }
  
  export interface UserDetails {
    isSelected: any;
    id: string;
    firstName: string;
    secondName: string;
    username: string;
    email: string;
    gender: string;
    churchType: string;
    profilePictureUrl: string;
    province: string;
    pin: string;
    churchName: string;
    verificationStatus: string;
    password: string;
    loginStatus: boolean;
    socialMediaLinkModels: SocialMediaLinkModels;
    postModelList: Post[]; // Assuming PostModel is another interface or type for posts
    weddingModelList: InvitationModel[];
    sentInvitation: InvitationModel[];
    whatsappNumber: string;
  }
  