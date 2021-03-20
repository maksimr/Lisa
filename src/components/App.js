import { useStore } from '@maksimr/ui/react/StoreLayer';
import { DateTime } from '@maksimr/ui/react/DateTime';
import { Route, Switch, useCurrentRoute } from '@maksimr/ui/react/Router';
import React, { useCallback } from 'react';
import { denormalize } from 'normalizr';
import { ISSUE_SCHEMA } from '../schema';
import assert from 'assert';

export function App() {
  const [{path}] = useStore();
  return (
    <Switch path={path}>
      <Route when="/">
        <IssueList/>
      </Route>
      <Route when="/issue/:id">
        <Issue/>
      </Route>
    </Switch>
  );
}

function Issue() {
  const [data] = useEntities();
  const route = useCurrentRoute();
  assert(route !== null);
  assert(route.params != null);
  assert(data !== null);
  const issueId = route.params.id;
  const issue = denormalize(data.issues[issueId], ISSUE_SCHEMA, data);
  return (
    <article className="px-4 py-2 my-2 container mx-auto">
      <BackButton/>
      <IssueMeta issue={issue}/>
      <IssueSummary issue={issue}/>
      <IssueDescription description={issue.description}/>
    </article>
  );
}

function BackButton() {
  return (
    <aside className="mb-8">
      <button
        className="bg-gray-100 px-4 py-1 rounded"
        onClick={() => window.history.back()}
      >
        ←
      </button>
    </aside>
  );
}

function IssueList() {
  const [entities] = useEntities();
  const [{issues}] = useCurrentViewState();
  return (
    <div className="px-4 py-2 my-2 container mx-auto">
      {issues?.map((issueId) => {
        const issue = denormalize(entities.issues[issueId], ISSUE_SCHEMA, entities);
        return <IssueItem issue={issue} key={issue.idReadable}/>;
      })}
    </div>
  );
}

function IssueItem({issue}) {
  return (
    <article className="mb-8">
      <IssueMeta issue={issue}/>
      <IssueSummary issue={issue}/>
      <IssueDescription description={issue.trimmedDescription}/>
    </article>
  );
}

function IssueSummary({issue}) {
  return (
    <header className="text-base font-semibold">
      <a href={`/issue/${issue.idReadable}`}>{issue.summary}</a>
    </header>
  );
}

function IssueDescription({description}) {
  return <p className="mt-3 text-base font-light">{description}</p>;
}

function IssueMeta({issue}) {
  const [pid, id] = issue.idReadable.split('-');
  return (
    <aside className="mt-1 mb-2 text-gray-600 text-xs font-light">
      <label>
        <span className="font-semibold p-1 rounded bg-gray-100">{pid}</span>
        {'-'}
        {id}
      </label>
      {Vdr()}
      <label>{issue.reporter.fullName}</label>
      {Vdr()}
      <label>
        <DateTime date={issue.created}/>
      </label>
    </aside>
  );
}

function Vdr() {
  return <span className="mx-1 text-gray-300">{' ∣ '}</span>;
}

function useCurrentViewState() {
  const selector = useCallback(
    (/**@type {import('../store').AppStore} */ state) => state.view[state.path],
    []
  );
  return useStore(selector);
}

function useEntities() {
  const selector = useCallback(
    (/**@type {import('../store').AppStore} */ state) => state.entities,
    []
  );
  return useStore(selector);
}
