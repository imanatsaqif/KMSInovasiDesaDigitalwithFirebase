import { Container, Background, CardContent, Title, Description, Logo } from './_cardInovatorStyle'

type CardInovatorProps = {
  background?: string;
  icon?: string;
  namaInovator?: string;
  kategoriInovator?: string;
  targetPengguna?: string;
  produk?: string;
  modelBisnis?: string;
  nomorWhatsApp?: string;
  linkInstagram?: string;
  linkWebsite?: string;
  id?: number;
  deskripsi?: string;

  onClick: () => void
}

function CardInovator(props: CardInovatorProps) {
  const { background, icon, namaInovator, kategoriInovator, targetPengguna, produk, modelBisnis, nomorWhatsApp, linkInstagram, linkWebsite, onClick } = props

  return (
    <Container onClick={onClick}>
      <Background src={background} alt={namaInovator} />
      <CardContent>
        <Logo src={icon} alt={namaInovator} />
        <Title>{namaInovator}</Title>
        <Description>10 Desa Dampingan</Description>
        <Description>10 Inovasi</Description>
      </CardContent>
    </Container>
  )
}

export default CardInovator
