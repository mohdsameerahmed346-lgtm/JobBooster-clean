const prompt = `
You are an expert ATS resume analyzer.

Analyze this resume for a Frontend Developer role.

Give output in this format:

1. ATS Score (0-100)
2. 3 specific improvements (VERY detailed, not generic)
3. Missing keywords (based on job role)
4. 1 rewritten strong bullet point example

Resume:
${resume}
`;
