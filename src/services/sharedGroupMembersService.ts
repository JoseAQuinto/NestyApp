import { supabase } from './supabase';

export type GroupMember = {
  id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
  profiles: {
    display_name: string | null;
    email: string | null;
  } | null;
};

export const sharedGroupMembersService = {
  async getMembers(groupId: string): Promise<GroupMember[]> {
    const { data, error } = await supabase
      .from('shared_group_members')
      .select(`
        id,
        user_id,
        role,
        joined_at,
        profiles (
          display_name,
          email
        )
      `)
      .eq('group_id', groupId);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as GroupMember[];
  },
};