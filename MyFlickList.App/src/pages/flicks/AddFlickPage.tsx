import classnames from 'classnames';
import React from 'react';
import { useHistory } from 'react-router';
import Alert from '../../components/Alert';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import Link from '../../components/Link';
import Page from '../../components/Page';
import Section from '../../components/Section';
import useAuth from '../../context/useAuth';
import api from '../../internal/api';
import routes from '../../routes';

export default function AddFlickPage() {
  const history = useHistory();
  const auth = useAuth();

  return (
    <Page title="Add Flick">
      <Section title="Add Flick">
        <p className={classnames('text-lg')}>
          If a movie or series you&apos;re looking for is not available, you can add it by simply
          copy-pasting its <Link href="https://imdb.com">IMDB</Link> link. All of the associated
          data will be pulled automatically.
        </p>

        <Form
          orientation="horizontal"
          defaultValues={{ sourceUrl: '' }}
          onSubmit={async (data) => {
            const { flickId } = await api.flicks(auth.token?.value).addFlick(data);
            history.push(routes.flicks.specific({ flickId }));
          }}
        >
          <FormInput
            className={classnames(['flex-grow'])}
            name="sourceUrl"
            placeholder="https://imdb.com/title/tt0029583"
            disabled={!auth.token}
            autoFocus
            required
          />

          <FormButton type="submit" disabled={!auth.token}>
            Pull
          </FormButton>
        </Form>

        {!auth.token && (
          <Alert className={classnames('mt-3')} type="error">
            You need to be <Link href={routes.auth.signIn()}>signed in</Link> to request a new flick
          </Alert>
        )}
      </Section>
    </Page>
  );
}
