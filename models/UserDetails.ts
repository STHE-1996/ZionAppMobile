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
    postId: string;
    userId: string;
    title: string;
    content: string; 
    localDateTime: number[];  
    postLikeModelList: PostLike[];
    postHeartModelList : PostHeart[];
    postIzibusisoModelList : PostIzibusiso[];
    comments:  Comment[];
    user: UserDetails;
  }
  
  export interface Comment {
    id: string;
    firstName: string;
    secondName: string;
    text: string;
    profilePictureUrl?: string;
    user: {
      profilePictureUrl?: string;
      firstName: string;
      secondName: string;
    };
  };

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
    postModelList: Post[];
    weddingModelList: InvitationModel[];
    sentInvitation: InvitationModel[];
    whatsappNumber: string;
  }
  
  export interface PostLike {
    PostLikeId : string;
    userId : string;
    firstName : string;
    lastName: string;
    profileUrl: string;
}


export interface PostHeart {
 PostHeartId : string;
 userId : string;
 firstName : string;
 lastName: string;
 profileUrl: string;
}


export interface PostIzibusiso {
 PostIzibusisoId : string;
 userId : string;
 firstName : string;
 lastName: string;
 profileUrl: string;
}