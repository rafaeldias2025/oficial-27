import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, UserCheck, Ruler, Edit3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { EditProfileModal } from './EditProfileModal';
import { User as UserType } from '@/types/user';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil } from 'lucide-react';

interface UserProfileHeaderProps {
  user: UserType;
  onEdit?: () => void;
}

export function UserProfileHeader({ user, onEdit }: UserProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
      <div className="relative">
        <img
          src={user.avatar_url || '/placeholder.svg'}
          alt={`Foto de ${user.name}`}
          className="w-16 h-16 rounded-full object-cover"
        />
        {onEdit && (
          <button
            onClick={onEdit}
            className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-500">
          Membro desde {format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>
    </div>
  );
}