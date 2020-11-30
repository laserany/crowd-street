import {
  render,
  queries,
  queryHelpers,
  waitFor,
  fireEvent,
} from '@testing-library/react'

const queryById = queryHelpers.queryByAttribute.bind(null, 'id')

export default function customRender(ui, options) {
  return render(ui, {
    queries: { ...queries, queryById },
    ...options,
  })
}

export async function accountCreationFormSubmitter(
  accountCreationFormRequest,
  userNameInput,
  passwordInput,
  confirmPasswordInput
) {
  const userName = accountCreationFormRequest.queryById(
    'formHorizontalUserName'
  )

  const password = accountCreationFormRequest.queryById(
    'formHorizontalPassword'
  )

  const confirmPassword = accountCreationFormRequest.queryById(
    'formHorizontalConfirmPassword'
  )

  await waitFor(() => {
    fireEvent.change(userName, {
      target: {
        value: userNameInput,
      },
    })
  })

  await waitFor(() => {
    fireEvent.change(password, {
      target: {
        value: passwordInput,
      },
    })
  })

  await waitFor(() => {
    fireEvent.change(confirmPassword, {
      target: {
        value: confirmPasswordInput,
      },
    })
  })

  const button = accountCreationFormRequest.getByRole('button', {
    name: 'Create new Account!',
  })
  await waitFor(() => fireEvent.click(button))
}
