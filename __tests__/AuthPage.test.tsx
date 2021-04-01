import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'

initTestHelpers()

// test에서는 env 변수를 불러올 수 없으므로 직접 지정
process.env.NEXT_PUBLIC_RESTAPI_URL = 'http://127.0.0.1:8000/api'

const handlers = [
  rest.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/jwt/create/`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ access: '123xyz' }))
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/register/`,
    (req, res, ctx) => {
      return res(ctx.status(201))
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/get-blogs/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 1,
            title: 'title1',
            content: 'content1',
            username: 'username1',
            tags: [
              { id: 1, name: 'tag1' },
              { id: 2, name: 'tag2' },
            ],
            created_at: '2021-01-12 14:59:41',
          },
          {
            id: 2,
            title: 'title2',
            content: 'content2',
            username: 'username2',
            tags: [
              { id: 1, name: 'tag1' },
              { id: 2, name: 'tag2' },
            ],
            created_at: '2021-01-13 14:59:41',
          },
        ])
      )
    }
  ),
]

const server = setupServer(...handlers)

beforeAll(async () => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => {
  server.close()
})

describe('AdminPage Test Cases', () => {
    it('Should route to index-page when login succeeded', async () => {
        // getPage는 next-page-tester이므로 router에 next에서 쓰듯 적어주면 된다
        const { page } = await getPage({ 
          route: '/admin-page'
        })
        render(page)
        expect(await screen.findByText('Login')).toBeInTheDocument()
        userEvent.type(screen.getByPlaceholderText('Username'), 'user1')
        userEvent.type(screen.getByPlaceholderText('Password'), 'user1')
        userEvent.click(screen.getByText('Login with JWT'))
        expect(await screen.findByText('blog page')).toBeInTheDocument()
    })
    it('Should not route to index-page when login failed', async () => {
      server.use(
        rest.post(
          `${process.env.NEXT_PUBLIC_RESTAPI_URL}/jwt/create/`,
          (req, res, ctx) => {
            return res(ctx.status(400))
          }
        ),
      )
      const { page } = await getPage({ 
        route: '/admin-page'
      })
      render(page)
      expect(await screen.findByText('Login')).toBeInTheDocument()
      userEvent.type(screen.getByPlaceholderText('Username'), 'user1')
      userEvent.type(screen.getByPlaceholderText('Password'), 'user1')
      // 이 때 이미 어떤 값을 주더라도 400 response를 받기 때문에 로그인에는 실패함
      userEvent.click(screen.getByText('Login with JWT'))
      expect(await screen.findByText('Login Error'))
      expect(await screen.findByText('Login')).toBeInTheDocument()
      expect(screen.queryByText('blog page')).toBeNull()
    })

    it('Should change to register mode', async () => {
      const { page } = await getPage({ 
        route: '/admin-page'
      })
      render(page)
      // 이 부분에서 await로 render가 끝날 때까지 기다려야 한다
      expect(await screen.findByText('Login')).toBeInTheDocument()
      expect(screen.getByText('Login with JWT')).toBeInTheDocument()
      userEvent.click(screen.getByTestId('mode-change'))
      expect(screen.getByText('Sign up')).toBeInTheDocument()
      expect(screen.getByText('Create new user')).toBeInTheDocument()
    })

    it('Should route to index-page when register+login succeeded', async () => {
      const { page } = await getPage({ 
        route: '/admin-page'
      })
      render(page)
      expect(await screen.findByText('Login')).toBeInTheDocument()
      userEvent.click(screen.getByTestId('mode-change'))
      userEvent.type(screen.getByPlaceholderText('Username'), 'user1')
      userEvent.type(screen.getByPlaceholderText('Password'), 'user1')
      userEvent.click(screen.getByText('Create new user'))
      expect(await screen.findByText('blog page')).toBeInTheDocument()
    })

    it('Should not route to index-page when registeration is failed', async () => {
      server.use(
        rest.post(
          `${process.env.NEXT_PUBLIC_RESTAPI_URL}/register/`,
          (req, res, ctx) => {
            return res(ctx.status(400))
          }
        ),
      )
      const { page } = await getPage({ 
        route: '/admin-page'
      })
      render(page)
      expect(await screen.findByText('Login')).toBeInTheDocument()
      userEvent.click(screen.getByTestId('mode-change'))
      userEvent.type(screen.getByPlaceholderText('Username'), 'user1')
      userEvent.type(screen.getByPlaceholderText('Password'), 'user1')
      userEvent.click(screen.getByText('Create new user'))
      expect(await screen.findByText('Registration Error'))
      expect(screen.findByText('Sign up')).toBeInTheDocument()
      expect(screen.queryByText('blog page')).toBeNull()
    })
})