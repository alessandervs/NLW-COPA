//Comprometimento

import Image from 'next/image'
import logoImg from '../assets/logo.svg'
import appPreviewImg from '../assets/app-nlw-copa-prev.png'
import usersAvatarExample from '../assets/avatares.png'
import iconCheck from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')



  const createPool = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const response = await api.post('pools', {
        title: poolTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso, o código foi copiado para área de transfência!')

      setPoolTitle('')

    } catch (err) {
      console.log('Erro:' + err)
      alert('Falha ao criar o bolão, tente novamente')
      setPoolTitle('')
    }
  }

  return (

    <div className="max-w-[1124px] gap-28 h-screen mx-auto grid grid-cols-2 items-center">
      <main>
        <Image src={logoImg} alt="Logo" />
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2 '>
          <Image src={usersAvatarExample} alt="" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount} </span>pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-gray-100'
            type="text"
            required
            placeholder='Qual o nome do seu bolão'
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />

          <button
            className='bg-yellow-500 hover:bg-yellow-700 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase'
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>
        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt='checked' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt='checked' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>

      </main>
      <Image
        src={appPreviewImg}
        alt="Dois Celularas com Previa do App NLW"
        quality={100}
      />
    </div>
  )
}



export const getStaticProps: GetStaticProps = async () => {

  const [pools, users, guesses] = await Promise.all([
    api.get('/pools/count'),
    api.get('/users/count'),
    api.get('/guesses/count')
  ])


  return {
    props: {
      poolCount: pools.data.count,
      userCount: users.data.count,
      guessCount: guesses.data.count

    },

    revalidate: 60 * 10

  }
}