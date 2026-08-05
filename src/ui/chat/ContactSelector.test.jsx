import React from 'react'
import { render } from '@testing-library/react'
import ContactSelector from './ContactSelector'

describe('ContactSelector', () => {
  test('renders only real participant contacts', () => {
    const { getByText, queryByText } = render(
      <ContactSelector
        contacts={['Alice Example', 'Bob Example']}
        onSelectContact={() => {}}
        goBack={() => {}}
      />
    )

    expect(getByText('Alice Example')).toBeInTheDocument()
    expect(getByText('Bob Example')).toBeInTheDocument()
    expect(queryByText('Messages and calls are end-to-end encrypted.')).not.toBeInTheDocument()
  })
})
