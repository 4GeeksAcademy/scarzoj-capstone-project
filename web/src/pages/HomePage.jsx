import { editProfile, getCurrentProfile } from '../services/api/users';
import { useRef, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router';
import defaultAvatar from '../assets/ImagenUsuarioGeneral.jpg';
import Grid from '@mui/material/Grid2';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  TextField,
} from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import Save from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CircularProgress from '@mui/material/CircularProgress';

export const Home = () => {
  const [profile, setProfile] = useState({
    username: 'user_name',
    display_name: 'display_name',
    description: '',
    avatarNumber: 'avatar',
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...profile });
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const objectUrlRef = useRef(null);

  //CARGA DEL USUARIO AL PRINCIPIO
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = await getCurrentProfile();
        const mapped = {
          display_name: data?.display_name ?? 'not_available',
          description: data?.description ?? 'not available',
          avatar: data?.avantar ?? 'not_available',
        };
        if (!cancel) {
          setProfile(mapped);
          setDraft(mapped);
        }
      } catch (e) {
        console.error('No se pudo cargar /me', e);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handlePickAvatar = () => {
    setEditing(true);
    if (fileRef.current) fileRef.current.click();
  };

  const handleAvatarChange = (e) => {
    try {
      const input = e.currentTarget;
      const file = input.files && input.files[0];
      if (!file) return;

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;

      setDraft((prev) => ({ ...prev, avatarUrl: url, avatarFile: file }));
      setProfile((prev) => ({ ...prev, avatarUrl: url }));

      input.value = '';
    } catch (err) {
      console.error('Error al procesar la imagen:', err);
    }
  };

  //GUARDAR CAMBIOS (NICK/DESCRIPTION)
  const handleSave = async () => {
    try {
      console.log('draft');
      console.log(draft);
      const mapped = {
        display_name: draft.display_name ?? profile.display_name ?? 'tu_nombre',
        description:
          draft.description ?? profile.display_name ?? 'tu_descripcion',
        avatar: draft.avatarNumber ?? profile.avatarNumber ?? '0',
      };
      console.log('mapped');
      console.log(mapped);
      await editProfile(mapped.display_name, mapped.description, mapped.avatar);

      setProfile(mapped);
      setDraft({ ...mapped });
      setEditing(false);
    } catch (e) {
      console.error('No se pudo guardar el perfil', e);
    }
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  if (loading) {
    return (
      <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 6,
        bgcolor: 'primary.main',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.15), rgba(255,255,255,.15))',
      }}
    >
      <Box
        sx={{
          width: { xs: '100vw', md: '75vw' },
          mx: 'auto',
          px: { xs: 2, md: 0 },
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          {/* Perfil */}
          <Grid size={{ xs: 12, md: 10 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  {/* Foto de usuario (editable) */}
                  <Box position="relative">
                    <Avatar
                      src={
                        (editing ? draft.avatarUrl : profile.avatarUrl) ||
                        defaultAvatar
                      }
                      alt={`${profile.nick || profile.username} avatar`}
                      sx={{ width: 200, height: 200 }}
                      slotProps={{
                        img: {
                          onError: (e) => {
                            e.currentTarget.src = defaultAvatar;
                          },
                          loading: 'lazy',
                        },
                      }}
                    />
                    <IconButton
                      type="button"
                      size="small"
                      sx={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'secondary.main' },
                      }}
                      onClick={handlePickAvatar}
                      aria-label="Cambiar foto de perfil"
                    >
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarChange}
                    />
                  </Box>

                  {/* Nick/usuario + descripción */}
                  <Box flex={1} sx={{ width: '100%' }}>
                    {!editing ? (
                      <>
                        <Typography variant="h5" fontWeight={800}>
                          {profile.display_name}{' '}
                          <Typography component="span" color="text.secondary">
                            @{profile.display_name}
                          </Typography>
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                          {profile.description ||
                            'Añade una breve descripción sobre ti.'}
                        </Typography>
                      </>
                    ) : (
                      <Stack spacing={1.5}>
                        <TextField
                          label="Nick"
                          value={draft.display_name}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              display_name: e.target.value,
                            }))
                          }
                          slotProps={{ input: { maxLength: 32 } }}
                        />
                        <TextField
                          label="Descripción"
                          multiline
                          minRows={3}
                          value={draft.description}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Cuéntanos algo breve sobre ti…"
                          slotProps={{ input: { maxLength: 500 } }}
                        />
                      </Stack>
                    )}
                  </Box>

                  {/* Editar perfil */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
                  >
                    {!editing ? (
                      <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => setEditing(true)}
                      >
                        Editar perfil
                      </Button>
                    ) : (
                      <>
                        <Button variant="outlined" onClick={handleCancel}>
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          onClick={handleSave}
                        >
                          Guardar
                        </Button>
                      </>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Colecciones*/}
          <Grid size={{ xs: 12, md: 10 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  gutterBottom
                  align="center"
                >
                  Mis colecciones
                </Typography>

                <Grid container spacing={3} justifyContent={'center'}>
                  <Grid xs={12} sm={4}>
                    <Button
                      component={RouterLink}
                      to="/favoritos"
                      // mismo tamaño para los 3
                      fullWidth
                      sx={{ py: 2.5, fontWeight: 800 }}
                      // color distinto
                      color="secondary"
                      variant="contained"
                    >
                      Favoritos
                    </Button>
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <Button
                      component={RouterLink}
                      to="/leidos"
                      fullWidth
                      sx={{ py: 2.5, fontWeight: 800 }}
                      color="success"
                      variant="contained"
                    >
                      Leídos
                    </Button>
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <Button
                      component={RouterLink}
                      to="/por-leer"
                      fullWidth
                      sx={{ py: 2.5, fontWeight: 800 }}
                      color="primary"
                      variant="contained"
                    >
                      Por leer
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
