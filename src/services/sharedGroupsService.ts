import { supabase } from './supabase';
import type {
  CreateSharedGroupDto,
  SharedGroup,
} from '../features/sharedGroups/types/sharedGroup.types';

const generateInviteCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';

  for (let i = 0; i < 6; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

const getAuthenticatedUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error('No hay usuario autenticado.');
  }

  return user;
};

export const sharedGroupsService = {
  async getMyGroups(): Promise<SharedGroup[]> {
    const user = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from('shared_group_members')
      .select(`
        group_id,
        shared_groups (
          id,
          owner_user_id,
          name,
          invite_code,
          created_at
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message);
    }

    const groups =
      data
        ?.map((item) => {
          const group = Array.isArray(item.shared_groups)
            ? item.shared_groups[0]
            : item.shared_groups;

          return group as SharedGroup | null;
        })
        .filter(Boolean) ?? [];

    return groups;
  },

  async createGroup({ name }: CreateSharedGroupDto): Promise<SharedGroup> {
    const user = await getAuthenticatedUser();

    const cleanName = name.trim();

    if (!cleanName) {
      throw new Error('El nombre del grupo es obligatorio.');
    }

    let createdGroup: SharedGroup | null = null;
    let lastError: string | null = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const inviteCode = generateInviteCode();

      const { data, error } = await supabase
        .from('shared_groups')
        .insert({
          owner_user_id: user.id,
          name: cleanName,
          invite_code: inviteCode,
        })
        .select('id, owner_user_id, name, invite_code, created_at')
        .single();

      if (!error && data) {
        createdGroup = data as SharedGroup;
        break;
      }

      lastError = error?.message ?? 'No se pudo crear el grupo.';
    }

    if (!createdGroup) {
      throw new Error(lastError ?? 'No se pudo crear el grupo.');
    }

    const { error: memberError } = await supabase
      .from('shared_group_members')
      .insert({
        group_id: createdGroup.id,
        user_id: user.id,
        role: 'owner',
      });

    if (memberError) {
      throw new Error(memberError.message);
    }

    return createdGroup;
  },

  async joinGroupByCode(inviteCode: string): Promise<SharedGroup> {
    const user = await getAuthenticatedUser();

    const cleanCode = inviteCode.trim().toUpperCase();

    if (!cleanCode) {
      throw new Error('El código es obligatorio.');
    }

    const { data: group, error: groupError } = await supabase
      .from('shared_groups')
      .select('id, owner_user_id, name, invite_code, created_at')
      .eq('invite_code', cleanCode)
      .single();

    if (groupError || !group) {
      throw new Error('No se encontró ningún grupo con ese código.');
    }

    const { data: existingMember, error: existingMemberError } = await supabase
      .from('shared_group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingMemberError) {
      throw new Error(existingMemberError.message);
    }

    if (existingMember) {
      return group as SharedGroup;
    }

    const { error: insertError } = await supabase
      .from('shared_group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'member',
      });

    if (insertError) {
      throw new Error(insertError.message);
    }

    return group as SharedGroup;
  },

  async getGroupById(groupId: string): Promise<SharedGroup> {
    const cleanGroupId = groupId.trim();

    if (!cleanGroupId) {
      throw new Error('El id del grupo es obligatorio.');
    }

    const { data, error } = await supabase
      .from('shared_groups')
      .select('id, owner_user_id, name, invite_code, created_at')
      .eq('id', cleanGroupId)
      .single();

    if (error || !data) {
      throw new Error('No se pudo cargar el grupo.');
    }

    return data as SharedGroup;
  },
};