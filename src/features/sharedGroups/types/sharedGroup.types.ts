export type SharedGroup = {
  id: string;
  owner_user_id: string;
  name: string;
  invite_code: string;
  created_at: string;
};

export type SharedGroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
};

export type CreateSharedGroupDto = {
  name: string;
};