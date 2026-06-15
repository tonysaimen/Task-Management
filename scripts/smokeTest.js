(async () => {
  const BASE = process.env.BASE || 'http://localhost:5000';
  const headers = { 'Content-Type': 'application/json' };

  const log = (label, obj) => console.log(`---- ${label} ----\n`, JSON.stringify(obj, null, 2));

  try {
    const healthRes = await fetch(`${BASE}/api/health`);
    const health = await healthRes.json();
    log('health', health);

    const testUser = { name: 'Smoke Tester', email: 'smoke.tester@example.com', password: 'Test1234!' };

    // Try register
    let registerRes = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(testUser),
    });
    let registerData = await registerRes.json();
    log('register', { status: registerRes.status, body: registerData });

    let token = null;
    if (registerRes.ok && registerData.token) {
      token = registerData.token;
    } else {
      // Try login
      const loginRes = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: testUser.email, password: testUser.password }),
      });
      const loginData = await loginRes.json();
      log('login', { status: loginRes.status, body: loginData });
      if (loginRes.ok && loginData.token) token = loginData.token;
    }

    if (!token) {
      console.error('No auth token obtained; aborting smoke test.');
      process.exit(2);
    }

    // Create a task
    const dueDate = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    const taskPayload = { title: 'Smoke Test Task', description: 'Created by smoke test', dueDate, priority: 'medium' };

    const createRes = await fetch(`${BASE}/api/tasks`, {
      method: 'POST',
      headers: { ...headers, Authorization: `Bearer ${token}` },
      body: JSON.stringify(taskPayload),
    });
    const createData = await createRes.json();
    log('createTask', { status: createRes.status, body: createData });

    // Fetch tasks
    const tasksRes = await fetch(`${BASE}/api/tasks`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const tasksData = await tasksRes.json();
    log('listTasks', { status: tasksRes.status, body: tasksData });

    console.log('Smoke test finished.');
  } catch (err) {
    console.error('Smoke test error:', err);
    process.exit(1);
  }
})();
