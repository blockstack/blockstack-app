(define-constant owner 'ST23DA7M8MW7T9DAHR8WADX72B80EVF2Q94S1B54X)

(define-fungible-token connect-token)
(begin (ft-mint? connect-token u10000000 owner))

(define-public (transfer
    (recipient principal)
    (amount uint)
  )
  (ok (ft-transfer? connect-token amount tx-sender recipient))
)

(define-public (faucet)
  (ok (ft-mint? connect-token u100 tx-sender))
)
