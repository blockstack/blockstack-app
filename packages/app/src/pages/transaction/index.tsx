import React, { Suspense, useMemo, useCallback, useState } from 'react';
import { Box, Button, Flex, Text } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { LoadingRectangle } from '@components/loading-rectangle';
import { useTxState } from '@common/hooks/use-tx-state';
import { stacksValue } from '@common/stacks-utils';
import { ContractCallDetails } from '@components/transactions/contract-call-details';
import { PostConditions } from '@components/transactions/post-conditions/list';
import { showTxDetails } from '@store/recoil/transaction';
import { useRecoilValue } from 'recoil';
import { TransactionTypes } from '@stacks/connect';
import { finishTransaction } from '@common/transaction-utils';
import { useWallet } from '@common/hooks/use-wallet';

export const TxLoading: React.FC = () => {
  return (
    <Flex flexDirection="column" mt="extra-loose">
      <Box width="100%">
        <LoadingRectangle width="60%" height="24px" />
      </Box>
      <Box width="100%" mt="base">
        <LoadingRectangle width="40%" height="16px" />
      </Box>
    </Flex>
  );
};

export const TransactionPage: React.FC = () => {
  return (
    <PopupContainer>
      <Suspense fallback={<TxLoading />}>
        <TransactionPageContent />
      </Suspense>
    </PopupContainer>
  );
};

export const TransactionPageContent: React.FC = () => {
  const { pendingTransaction, signedTransaction, contractInterface } = useTxState();
  const { currentNetwork } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showDetails = useRecoilValue(showTxDetails);
  const txType = pendingTransaction?.txType;
  const pageTitle = useMemo(() => {
    if (txType === TransactionTypes.STXTransfer) {
      return 'Transfer STX';
    } else if (txType === TransactionTypes.ContractDeploy) {
      return 'Deploy contract';
    }
    return 'Sign transaction';
  }, [txType]);

  const nodeUrl = currentNetwork.url;
  const submit = useCallback(async () => {
    if (!pendingTransaction || !signedTransaction) return;
    setIsSubmitting(true);
    await finishTransaction({ tx: signedTransaction, pendingTransaction, nodeUrl });
    setIsSubmitting(false);
  }, [pendingTransaction, signedTransaction, nodeUrl]);
  return (
    <>
      <Box mt="extra-loose">
        <Text fontSize={5} fontWeight="500" display="block">
          {pageTitle}
        </Text>
        <Text textStyle="caption" color="ink.600">
          {pendingTransaction?.appDetails?.name}
        </Text>
      </Box>
      <PostConditions />
      {showDetails && (
        <ContractCallDetails
          pendingTransaction={pendingTransaction}
          contractInterface={contractInterface}
        />
      )}
      <Box flexGrow={1} />
      <Box width="100%" mt="extra-loose">
        <Flex>
          <Box flexGrow={1}>
            <Text textStyle="caption" color="ink.600">
              Fees
            </Text>
          </Box>
          <Box>
            <Text textStyle="caption" color="ink.600">
              {stacksValue({
                value: signedTransaction?.auth.spendingCondition?.fee?.toNumber() || 0,
              })}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box mt="base">
        <Button width="100%" onClick={submit} isLoading={isSubmitting}>
          Confirm
        </Button>
      </Box>
    </>
  );
};
