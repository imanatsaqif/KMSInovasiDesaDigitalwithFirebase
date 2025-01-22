import React, { useEffect, useState } from "react";
import { paths } from "Consts/path";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Button from "Components/button";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { register as registerEndpoint, GoogleLogin } from "Services/authServices";
import useAuthLS from "Hooks/useAuthLS";  // Impor hook useAuthLS
import { db } from "../../firebase/clientApp";
import { getDoc, doc, updateDoc } from "firebase/firestore";  // Import Firestore methods
import {
  Background,
  Container,
  Title,
  Description,
  Label,
  ActionContainer,
  Action,
  CheckboxContainer,
} from "./_registerStyle";

function Register() {
  const navigate = useNavigate();
  const form = useForm();
  const { handleSubmit, register, reset, setValue } = form;

  const { auth, setAuth } = useAuthLS();  // Mendapatkan state auth dan setAuth

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { mutateAsync } = useMutation(registerEndpoint);

  // Cek status otentikasi saat halaman dimuat
  useEffect(() => {
    if (auth.id && auth.role) {
      // Jika user sudah login dan memiliki role, arahkan ke halaman sesuai dengan role
      if (auth.role === "innovator") {
        navigate(paths.INNOVATOR_PROFILE_PAGE);
      } else if (auth.role === "village") {
        navigate(paths.VILLAGE_PROFILE_PAGE);
      }
    }
  }, [auth, navigate]); // Efek ini hanya dijalankan jika auth berubah

  const handleSubmitRole = async (data: any) => {
    try {
      if (!auth.id) {
        toast("Anda harus login terlebih dahulu.", { type: "error" });
        return;
      }

      const userRef = doc(db, "users", auth.id);
      await updateDoc(userRef, {
        role: data.role,  // Menyimpan role yang dipilih
      });

      setAuth((prevAuth) => ({
        ...prevAuth,
        role: data.role, // Update role di state auth
      }));

      toast("Role berhasil diperbarui.", { type: "success" });
      navigate(paths.LANDING_PAGE);  // Navigasi ke halaman utama
    } catch (error) {
      console.error("Error updating role: ", error);
      toast("Gagal memperbarui role.", { type: "error" });
    }
  };

  return (
    <Background>
      <Container>
        <Title>Halo!</Title>
        <Description>Silakan melanjutkan registrasi akun</Description>

        <form onSubmit={handleSubmit(handleSubmitRole)}>
          <Label mt={12}>Daftar sebagai:</Label>
          <CheckboxContainer mt={12}>
            <input
              type="radio"
              value="innovator"
              {...register("role", { required: true })}
            />
            <Label>Inovator</Label>
          </CheckboxContainer>

          <CheckboxContainer mt={12}>
            <input
              type="radio"
              value="village"
              {...register("role", { required: true })}
            />
            <Label>Perangkat desa</Label>
          </CheckboxContainer>


          <Button size="m" fullWidth mt={12} type="submit">
            Registrasi Google
          </Button>
        </form>

        <ActionContainer mt={24}>
          <Label>Sudah memiliki akun?</Label>
          <Action onClick={() => navigate(paths.LOGIN_PAGE)}>Login</Action>
        </ActionContainer>
      </Container>
    </Background>
  );
}

export default Register;