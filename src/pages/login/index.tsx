import {useUnitContainer} from "../../units/UnitContainerProvider";
import {AuthUnit} from "../../units/AuthUnit";

function LoginPage() {
  const container = useUnitContainer();
  const auth = container.resolve(AuthUnit);

  return (
    <div>
      <h1>login</h1>
      <button>Continue as guest</button>
      <button>
        associate guest "{auth.username}" with an account
      </button>
    </div>
  )
}

export default LoginPage;
