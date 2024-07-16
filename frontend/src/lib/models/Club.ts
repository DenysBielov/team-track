export interface Club {
  id?: string | undefined;
  name: string;
}

export interface ClubCreate {
  name: string;
  adminId: string;
}