

const Forget_password = () => {
  return (
    <div>
        <form className="w-[700px] h-52 mx-auto my-5 shadow-md">
            <h2 className="text-4xl">Forget Password</h2>
            <div className="my-5">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" className="email"  />
            </div>
            <button>Froget password</button>
        </form>
    </div>
  )
}

export default Forget_password