function ErrorMessage({
  message = 'Something went wrong. Please try again.'
}) {
  return (
    <div className="error-message">
      <strong>Unable to load</strong>

      <p>{message}</p>
    </div>
  )
}

export default ErrorMessage