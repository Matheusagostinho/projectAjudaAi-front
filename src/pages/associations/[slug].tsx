import {
  Box,
  Heading,
  Icon,
  Image,
  Text,
  useBreakpointValue,
  useDisclosure,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import Cards from 'components/Cards'
import { Button } from 'components/Form/Button'
import { InicialModal } from 'components/InicialModal'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'
import { useEffect } from 'react'
import { MdSwapHoriz } from 'react-icons/md'
import { api } from 'services/api'
import { Header } from '../../components/Header'
type Association = {
  id: string
  name: string
  description: string
  urlImage: string
}
type City = {
  id: string
  name: string
}

type dataProps = {
  associations: Association[]
  nameCity: string
}

export default function Associations({ associations, nameCity }: dataProps) {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  function toReplaceCity() {
    destroyCookie(undefined, 'ajudaai.cityId', { path: '/' })
    destroyCookie(undefined, 'ajudaai.citySlug', { path: '/' })
    destroyCookie(undefined, 'ajudaai.cityName', { path: '/' })
    router.push('/')
  }
  useEffect(() => {
    onOpen()
  }, [])
  return (
    <>
      <Header>
        <Box
          display="flex"
          flexDir="column"
          alignContent="center"
          justifyContent="center"
          textAlign="center"
        >
          {isWideVersion && associations.length > 0 && (
            <Box w="100%">
              <Text display="flex">
                Em {nameCity} mais de
                <Text color="red.500" fontWeight="bold" mx="1">
                  {String(associations.length * 100)} pessoas
                </Text>
                precisam da sua Ajuda!
              </Text>
            </Box>
          )}
        </Box>
      </Header>
      <Box
        mt="100px"
        px={['4', '16', '6', '20']}
        py="2"
        display="flex"
        flexDir="column"
        justifyContent="center"
      >
        {associations.length !== 0 ? (
          <>
            {/* <h1> Campanhas em {nameCity}</h1>
            <Wrap spacing="8px"></Wrap> */}
            <Heading size="lg" mb="4">
              Associações em {nameCity}:
            </Heading>
            <Wrap spacing="8px">
              {associations.map(association => (
                <WrapItem key={association.id}>
                  <Cards association={association} />
                </WrapItem>
              ))}
            </Wrap>
          </>
        ) : (
          <Box
            height="100%"
            mt="6rem"
            alignItems="center"
            display="flex"
            flexDir="column"
            justify="center"
          >
            <Image src="/images/searching.svg" maxW="320px" />
            <Text display="block" fontWeight="bold" textAlign="center">
              Ops...
            </Text>

            <Text display="block" mt="2" color="gray.400" textAlign="center">
              Ainda não tem associações cadastradas em sua cidade!
            </Text>
            <Button
              mt="2"
              onClick={toReplaceCity}
              leftIcon={<Icon as={MdSwapHoriz} fontSize="20" />}
              size="md"
            >
              Trocar de Cidade
            </Button>
          </Box>
        )}
      </Box>
      {!isWideVersion && associations.length > 0 && (
        <InicialModal isOpen={isOpen} onClose={onClose}>
          <Box
            h="100%"
            w="100%"
            display="flex"
            p="10"
            textAlign="center"
            flexDir="column"
          >
            <Image src="/images/team.svg" size="200px" />
            <Text fontSize="xl" lineHeight="1">
              Em {nameCity} mais de
              <Text color="red.500" fontWeight="bold">
                {' '}
                {String(associations.length * 100)} pessoas
              </Text>{' '}
              precisam da sua Ajuda!
            </Text>
          </Box>
        </InicialModal>
      )}
    </>
  )
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const { data } = await api.get('/cities')

//   const paths = data.map(city => ({
//     params: {
//       slug: city.slug
//     }
//   }))

//   return {
//     paths,
//     fallback: true
//   }
// }

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { slug } = ctx.params

  const city = await api.get(`/cities/${slug}`)

  const { data } = await api.get(`/associations/${city.data._id}`)

  const nameCity = city.data.name

  const associations = data.map(item => ({
    id: item._id,
    name: item.name,
    description: item.description,
    urlImage: item.url_image
  }))

  return {
    props: {
      associations,
      nameCity
    }
    // revalidate: 60 * 30 // 30 minutes
  }
}
