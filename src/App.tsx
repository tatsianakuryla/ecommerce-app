import { Container, Heading, Spacer } from '@chakra-ui/react'
import { LoginForm } from './components/LoginForm/LoginForm'

function App() {
  return (
    <Container>
      <Heading>E-commerce</Heading>
      <Spacer />
      <LoginForm></LoginForm>
    </Container>
  )
}

export default App
