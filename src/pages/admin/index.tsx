import Link from 'next/link'
import { Button } from '../../components/Form/Button'
import { FiLogIn } from 'react-icons/fi'
import styles from '../../styles/admin.module.scss'
import Head from 'next/head'
import { Input } from '../../components/Form/Input'
import { BsArrowRightShort } from 'react-icons/bs'
import { Icon, SlideFade } from '@chakra-ui/react'
import { FormEvent, useState } from 'react'
import router, { useRouter } from 'next/router'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'

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

export default function Portal() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  })
  const { errors } = formState
  const handleSignIn: SubmitHandler<SignInFormData> = async (values, event) => {
    event.preventDefault()
    router.push('/admin/dashboard')
    // await new Promise(resolve => setTimeout(resolve, 1500))
    // console.log(values)
  }
  return (
    <>
      <Head>
        <title>Portal Associação- Ajuda ai</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div id={styles.pageAuth}>
        <main>
          <SlideFade in={true} offsetY="-20px" className={styles.mainContent}>
            <img src="/images/logo.png" alt="AjudaAi" />

            <h1>Faça seu login</h1>
            <form onSubmit={handleSubmit(handleSignIn)}>
              <Input
                type="email"
                placeholder="E-mail"
                error={errors.email}
                {...register('email')}
              />
              <Input
                type="password"
                placeholder="Senha"
                error={errors.password}
                {...register('password')}
                mt="2"
              />

              <Button
                type="submit"
                leftIcon={<Icon as={FiLogIn} />}
                isLoading={formState.isSubmitting}
                w="100%"
                mt="3"
              >
                Entrar
              </Button>
            </form>
            <Link href="/admin/cadastrar">
              <a>
                <span> Não tenho cadastro </span>
                <BsArrowRightShort />
              </a>
            </Link>
          </SlideFade>
        </main>
        <aside>
          <SlideFade in={true} offsetY="20px">
            <img
              src="images/illustrationred.png"
              alt="Ilustração simbolizando perguntas e respostas"
            />
          </SlideFade>
        </aside>
      </div>
    </>
  )
}
