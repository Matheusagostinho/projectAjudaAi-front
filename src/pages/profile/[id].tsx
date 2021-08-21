import {
  IconButton,
  SlideFade,
  Stack,
  Checkbox,
  VStack,
  Grid,
  Box,
  GridItem
} from '@chakra-ui/react'
import { BsArrowLeftShort } from 'react-icons/bs'
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { Header } from '../../components/Header'
import { Button } from '../../components/Form/Button'
import styles from '../../styles/profile.module.scss'
import { useState } from 'react'
import { Input } from '../../components/Form/Input'
import { api } from 'services/api'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'

type Association = {
  id: string
  name: string
  description: string
  urlImage: string
  phone: string
  since: string
  about: string
}
type DataProps = {
  association: Association
}

type SignInFormData = {
  email: string
  password: string
}

const signInFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('O E-mail é um campo obrigatório')
    .email('E-mail Inválido'),
  password: yup.string().required('A senha é um campo obrigatório')
})
export default function ProfileAssociation({ association }: DataProps) {
  const [formDonate, setFormDonate] = useState(false)

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  })
  const { errors } = formState
  const handleSignIn: SubmitHandler<SignInFormData> = async (values, event) => {
    event.preventDefault()

    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(values)
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main>
          <div className={styles.aside}>
            <img src={association.urlImage} alt="Imagem da associação" />
            <h2> {association.name}</h2>
            <span>Ajudando desde {association.since}</span>
            <h3>Contato:</h3>
            <p>{association.phone}</p>
          </div>
          <div className={styles.content}>
            <SlideFade
              in={formDonate === false ? true : false}
              offsetY="20px"
              unmountOnExit
            >
              <h2>Sobre:</h2>
              <div>
                <p>{association.about}</p>
              </div>
              <h2>Projetos sociais:</h2>
              <h2>Campanhas:</h2>
              <h2>Conheça mais sobre nós:</h2>
            </SlideFade>
            <SlideFade in={formDonate} offsetY="200px" unmountOnExit>
              <VStack
                as="form"
                onSubmit={handleSubmit(handleSignIn)}
                spacing="2"
                className={styles.formDonor}
              >
                <h3>Dados de Retirada</h3>
                <Input
                  error={errors.name}
                  {...register('name')}
                  placeholder="Seu Nome"
                />
                <Input
                  placeholder="Telefone"
                  error={errors.phone}
                  {...register('phone')}
                />
                <Input
                  placeholder="Rua"
                  error={errors.street}
                  {...register('street')}
                />

                <Box display="flex">
                  <Grid templateColumns="repeat(6, 1fr)" gap={2}>
                    <GridItem colSpan={4} h="10">
                      <Input
                        type="text"
                        placeholder="Bairro"
                        error={errors.district}
                        {...register('district')}
                      />
                    </GridItem>
                    <GridItem colSpan={2} h="10">
                      <Input
                        type="number"
                        placeholder="Número"
                        error={errors.number}
                        {...register('number')}
                      />
                    </GridItem>
                  </Grid>
                </Box>

                <h3>Data de Retirada</h3>
                <Box display="flex">
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    <GridItem colSpan={1} h="10">
                      <Input
                        type="date"
                        placeholder="Cidade"
                        error={errors.city}
                        {...register('city')}
                      />
                    </GridItem>
                    <GridItem colSpan={1} h="10">
                      <Input
                        type="time"
                        placeholder="UF"
                        error={errors.uf}
                        {...register('uf')}
                      />
                    </GridItem>
                  </Grid>
                </Box>

                <h3>O que irá doar?</h3>
                <Stack
                  spacing={3}
                  className={styles.donate}
                  display="flex"
                  flexDir="column"
                  align="flex-start"
                  justifyContent="flex-start"
                  width="100%"
                >
                  <Checkbox colorScheme="red" size="lg" display="block">
                    Alimentos não perecíveis
                  </Checkbox>
                  <Checkbox colorScheme="red" size="lg">
                    Alimentos perecíveis
                  </Checkbox>
                  <Checkbox colorScheme="red" size="lg">
                    Roupas
                  </Checkbox>
                  <Checkbox colorScheme="red" size="lg">
                    Brinquedos
                  </Checkbox>
                  <Checkbox colorScheme="red" size="lg" co>
                    Outros
                  </Checkbox>
                </Stack>
              </VStack>
            </SlideFade>
          </div>
        </main>
        <footer>
          {formDonate ? (
            <>
              <IconButton
                variant="outline"
                colorScheme="red"
                aria-label="Send email"
                onClick={e => setFormDonate(false)}
                icon={<BsArrowLeftShort size="2.5rem" />}
                marginRight="1rem"
                borderRadius="8px"
                h={['42px', '45px']}
                w={['42px', '45px']}
              />
              <Button
                type="button"
                onClick={e => setFormDonate(false)}
                w="320px"
              >
                Finalizar Doação :D
              </Button>
            </>
          ) : (
            <Button type="button" onClick={e => setFormDonate(true)} w="320px">
              Doe sem sair de casa :{')'}
            </Button>
          )}
        </footer>
      </div>
    </>
  )
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const { data } = await api.get('/associations/pirapora-mg', {
//     params: {
//       __limit: 6
//     }
//   })

//   const paths = data.map(association => ({
//     params: {
//       id: association._id
//     }
//   }))

//   return {
//     paths,
//     fallback: 'blocking'
//   }
// }

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { id } = ctx.params
  const { data } = await api.get(`/profile/${id}`, {})

  const association = {
    id: data._id,
    name: data.name,
    description: data.description,
    urlImage: data.url_image,
    phone: data.phone,
    since: data.since,
    about: data.about
  }

  return {
    props: {
      association
    }
    // revalidate: 60 * 30 // 30 minutes
  }
}
