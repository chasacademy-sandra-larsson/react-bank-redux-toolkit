import { useState } from "react";
import type { RootState, AppDispatch } from "../store/store"; // Importera types från store.ts
import { useSelector, useDispatch } from "react-redux"; // Redux hooks för att använda globala state och dispatcha actions
import { openAccount, closeAccount, deposit, withdraw, requestLoan, payLoan } from "../store/accountSlice"; // Importera actions från accountSlice.ts


function AccountOperations() {
  //Lokal states
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [purpose, setLoanPurpose] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");

 // Redux - hämta från globala state
  const {isActive, balance, loan, loanPurpose, isLoading} = useSelector((state: RootState) => state.counter.value)
  // Redux - dispatch för att dispatcha actions
  const dispatch = useDispatch<AppDispatch>();

  // Redux - actions
  
  const handleOpenAccount = () => {
    // Dispatcha action för att öppna konto
    dispatch(openAccount());
  }

  const handleCloseAccount = () => {
    // Dispatcha action för att stänga konto
    dispatch(closeAccount());
  }

  const handleWithdrawal = () => {
    // Dispatcha action för att göra uttag, beloppet som argument ör payload
    dispatch(withdraw(Number(withdrawalAmount)));
    // Nollställ input
    setWithdrawalAmount("");
  } 

  const handleDeposit = () => {
    // Dispatcha action för att göra insättning, beloppet och valutan som argument är payload
    dispatch(deposit({ amount: Number(depositAmount), currency }));
    // Nollställ input
    setDepositAmount("");
  }

  const handleRequestLoan = () => {
    // Dispatcha action för att göra låneansökan, beloppet och syftet som argument är payload
    dispatch(requestLoan({amount: Number(loanAmount), purpose}));
    // Nollställ input
    setLoanAmount("");
    setLoanPurpose("");
  }

  const handlePayLoan = () => {
    // Dispatcha action för att betala tillbaka lån, beloppet som argument är payload
    dispatch(payLoan(loan));
    // Nollställ input
    setLoanAmount("");
  }

  return (
    // Formulär för att göra operationer på kontot. Saldo, lån och valuta hämtas från globala state.
    <div>
      <h2>Your account operations</h2>
      <p>Current balance: {balance}</p>
      <p>Current loan: {loan}</p>
      <div className="inputs">
        <div>
          <label>Open Account</label>
          <button
          onClick={handleOpenAccount}
          disabled={isActive}
        >
          Open account
        </button>
        </div>
        <div>
          <label>Close Account</label>
          <button
          onClick={handleCloseAccount}
          disabled={!isActive}
        >
          Close account
        </button>
        </div>
        <div>
          <label>Deposit</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDepositAmount(e.target.value)
            }
          />
          <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">US Dollar</option>
          <option value="EUR">Euro</option>
          <option value="GBP">British Pound</option>
        </select>
        <button onClick={handleDeposit} disabled={isLoading}>
          {isLoading ? "Converting..." : `Deposit ${depositAmount}`}
        </button>
        </div>

        <div>
          <label>Withdraw</label>
          <input
            type="number"
            value={withdrawalAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWithdrawalAmount(e.target.value)
            }
          />
          <button onClick={handleWithdrawal}>
            Withdraw {withdrawalAmount}
          </button>
        </div>

        <div>
          <label>Request loan</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLoanAmount(e.target.value)
            }
            placeholder="Loan amount"
          />
          <input
            value={purpose}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLoanPurpose(e.target.value)
            }
            placeholder="Loan purpose"
          />
          <button onClick={handleRequestLoan}>Request loan</button>
        </div>

        {loan > 0 && (
        <div>
          <span>
            Pay back ${loan} ({loanPurpose})
          </span>
          <button onClick={handlePayLoan}>Pay loan</button>
        </div>
      )}
      </div>
    </div>
  );
}

export default AccountOperations;
