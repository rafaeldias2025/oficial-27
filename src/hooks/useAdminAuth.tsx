
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
  const { user, session } = useAuth();
  console.log('User:', user);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      console.log('Checking admin role for user:', user?.id, 'Session exists:', !!session);
      
      if (!session) {
        console.log('No session found');
        setIsAdmin(false);
        setLoading(false);
        navigate('/auth');
        return;
      }

      if (!user) {
        console.log('No user found in session');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for user:', user.id);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        console.log('Profile:', profile);

        if (!profile) {
          console.log('Profile not found, creating new one');
          const { data, error } = await supabase
            .from('rich_text_content')
            .insert([{
              user_id: user.id,
              content: 'Teste de conteúdo',
              created_at: new Date().toISOString()
            }])
            .select()
            .single();
          console.log('Resultado do insert:', { data, error });
          // Assuming a default role or that the profile will be updated later
          setIsAdmin(false); // Default to not admin if profile is new
        } else {
          console.log('Profile found:', profile);
          const adminStatus = profile?.role === 'admin';
          console.log('Is admin?', adminStatus);
          setIsAdmin(adminStatus);
          
          if (!adminStatus) {
            console.log('User is not admin, redirecting to home');
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Erro na verificação de admin:', error);
        setIsAdmin(false);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, session, navigate]);

  return { isAdmin, loading };
};
