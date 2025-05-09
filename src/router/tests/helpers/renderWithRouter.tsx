import { PropsWithChildren, ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { RenderResult } from '@testing-library/react'
import { Provider } from '@/components/ui/provider'

type Options = { initialEntries?: string[] }

export function renderWithRouter(
  element: ReactElement,
  { initialEntries = ['/'] }: Options = {},
): RenderResult {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  )

  return render(element, { wrapper: Wrapper })
}
