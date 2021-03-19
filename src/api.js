import { ISSUE_SCHEMA } from './schema';
import { updateEntities } from './store';

function request(path) {
  return fetch(`https://youtrack.jetbrains.com/api${path}`).then((response) =>
    response.json()
  );
}

export function fetchIssues() {
  return request(
    '/issues?$top=15&fields=idReadable,summary,trimmedDescription,description,created,reporter(fullName,login),updater(fullName,login)'
  ).then((data) => {
    return updateEntities(data, [ISSUE_SCHEMA]);
  });
}
