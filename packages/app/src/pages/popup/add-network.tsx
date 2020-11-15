import React from 'react';
import { Box, Text, Input, InputGroup, Button } from '@stacks/ui';
import { Formik } from 'formik';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useDispatch } from '@common/hooks/use-dispatch';
import { doAddNetwork } from '@store/wallet/actions';

export const AddNetwork: React.FC = () => {
  const { doChangeScreen } = useAnalytics();
  const dispatch = useDispatch();
  return (
    <PopupContainer title="Add a network" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)}>
      <Box mt="base">
        <Text>
          Enter an address from the{' '}
          <a href="https://docs.blockstack.org/references/stacks-blockchain-api">Sidecar API</a>{' '}
          that proxies a node. Before using a new node, Make sure you review and trust the host
          before configuring a new Sidecar API.
        </Text>
      </Box>
      <Formik
        initialValues={{ name: '', url: '', key: '' }}
        onSubmit={values => {
          dispatch(doAddNetwork(values));
          doChangeScreen(ScreenPaths.POPUP_HOME);
        }}
      >
        {({ handleSubmit, values, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <Box width="100%" mt="extra-loose">
              <InputGroup flexDirection="column">
                <Text
                  as="label"
                  display="block"
                  mb="tight"
                  fontSize={1}
                  fontWeight="500"
                  htmlFor="name"
                >
                  Name
                </Text>
                <Input
                  display="block"
                  width="100%"
                  value={values.name}
                  onChange={handleChange}
                  name="name"
                />
              </InputGroup>
            </Box>
            <Box width="100%" mt="extra-loose">
              <InputGroup flexDirection="column">
                <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" for="url">
                  Address
                </Text>
                <Input
                  display="block"
                  width="100%"
                  value={values.url}
                  onChange={handleChange}
                  name="url"
                />
              </InputGroup>
            </Box>
            <Box width="100%" mt="extra-loose">
              <InputGroup flexDirection="column">
                <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" for="key">
                  Key
                </Text>
                <Input
                  display="block"
                  width="100%"
                  value={values.key}
                  onChange={handleChange}
                  name="key"
                />
              </InputGroup>
            </Box>
            <Box mt="loose">
              <Button width="100%">Add network</Button>
            </Box>
          </form>
        )}
      </Formik>
    </PopupContainer>
  );
};
