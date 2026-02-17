import requests
from config import NVIDIA_API_KEY
from middleware.failure_containment import retry_with_backoff, ExternalAPIError, nvidia_circuit_breaker
from middleware.observability import StructuredLogger

logger = StructuredLogger(__name__)


@retry_with_backoff(max_retries=3, exceptions=(requests.RequestException,))
def generate_plain_english_document(transcript: str) -> str:
    """
    Generate plain English document from transcript.
    
    Guarantees:
    - Input validation (Safe Inputs)
    - Retry logic (Failure Containment)
    - Circuit breaker (Failure Containment)
    - Timeout protection (Failure Containment)
    - Structured logging (Operational Discipline)
    """
    if not transcript or len(transcript.strip()) == 0:
        raise ValueError("Transcript cannot be empty")
    
    prompt = f"""
You are a professional technical writer.

Convert the following spoken transcript into a clear, well-written English document.

Rules:
- Use simple, professional English
- Remove fillers, repetitions, and spoken artifacts
- Preserve original meaning accurately
- Do NOT summarize
- Do NOT add new information
- Output ONLY the final document text

TRANSCRIPT:
{transcript}
"""

    def _call_nvidia_api():
        response = requests.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Accept": "application/json"
            },
            json={
                "model": "meta/llama-4-maverick-17b-128e-instruct",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
                "max_tokens": 1200
            },
            timeout=30.0  # Timeout protection
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
    
    try:
        logger.info("Generating plain English document")
        result = nvidia_circuit_breaker.call(_call_nvidia_api)
        logger.info("Document generation completed", length=len(result))
        return result
    except Exception as e:
        logger.error("Document generation failed", error=str(e))
        raise ExternalAPIError(f"NVIDIA API failed: {str(e)}") from e


@retry_with_backoff(max_retries=3, exceptions=(requests.RequestException,))
def generate_charter_compliant_output(transcript: str, syllabus: str = "") -> str:
    """
    Generate charter-compliant pedagogical analysis.
    
    Args:
        transcript: Raw transcription from audio
        syllabus: Optional syllabus/curriculum context for comparison
    
    Guarantees:
    - Input validation (Safe Inputs)
    - Retry logic (Failure Containment)
    - Circuit breaker (Failure Containment)
    - Timeout protection (Failure Containment)
    - Structured logging (Operational Discipline)
    """
    if not transcript or len(transcript.strip()) == 0:
        raise ValueError("Transcript cannot be empty")
    
    syllabus_context = ""
    if syllabus and len(syllabus.strip()) > 0:
        syllabus_context = f"""

SYLLABUS/CURRICULUM CONTEXT:
{syllabus}

Use this syllabus to evaluate coverage and alignment in your analysis.
"""
    
    prompt = f"""
You are an AI Classroom Observation Engine specialized in pedagogical analysis.

Your goal: Analyze teaching methods in a clear, human-readable way that educators can easily understand and act upon.

CRITICAL RULES:
- DO NOT summarize or rewrite lecture content
- ONLY analyze teaching methodology and observable behaviors
- Write in a conversational, professional tone
- Be specific and descriptive
- Provide context and explanation for your observations

Your task:
Analyze the teaching approach and provide clear insights on:

1. **Question Frequency & Quality**: How often does the instructor ask questions? Are they distributed well?
2. **Wait Time & Pacing**: Does the instructor pause after questions to allow thinking? How's the overall pacing?
3. **Student Engagement**: How much space is there for student participation? Is it a dialogue or monologue?
4. **Cultural Contextualization**: Any code-switching (Hindi/English) that shows cultural adaptation?{syllabus_context}

OUTPUT STYLE (Human-Readable & Conversational):

Write 4-5 complete sentences in a natural, flowing style. Think of it as a mini observation report.

EXAMPLE 1 (Interactive lecture):
The instructor maintained good engagement throughout the session, asking approximately 8 questions over the 30-minute period (about 2.7 questions every 10 minutes). After posing questions, there were noticeable pauses averaging 4 seconds, which gave students time to think before responding. The class динаміc showed a healthy balance, with the instructor speaking about 65% of the time while students contributed through responses and discussion for the remaining 35%. Several instances of Hindi-English code-switching were observed, including phrases like "chalo start karte hain" and "samajh mein aaya?", which helped create a culturally comfortable learning environment.

EXAMPLE 2 (Lecture-style delivery):
This session followed a traditional lecture format with the instructor delivering content continuously without posing questions to students. The pacing was steady and content-focused, with no pauses for student interaction or response time measurement. The instructor maintained full speaking time throughout the session (100%), creating a monologue-style presentation rather than an interactive discussion. No code-switching between Hindi and English was detected, suggesting a formal, English-only delivery approach.

EXAMPLE 3 (Moderate interaction):
The instructor asked 3 questions during the 15-minute segment, averaging about 2 questions per 10 minutes, which shows some attempt at engagement. However, the wait time after questions was brief—only 1-2 seconds—which is below the recommended 3-second threshold for effective think time. Student participation was minimal, with the instructor dominating about 90% of the speaking time while students contributed occasionally. A few Hindi words like "accha" and "bas" were used during transitions, adding a subtle cultural touch to an otherwise formal presentation.

TRANSCRIPT TO ANALYZE:
{transcript}

Now provide your analysis in a natural, flowing paragraph format that's easy to read and understand:
"""

    def _call_nvidia_api():
        response = requests.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Accept": "application/json"
            },
            json={
                "model": "meta/llama-4-maverick-17b-128e-instruct",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
                "max_tokens": 800
            },
            timeout=30.0  # Timeout protection
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
    
    try:
        logger.info("Generating charter-compliant analysis")
        result = nvidia_circuit_breaker.call(_call_nvidia_api)
        logger.info("Analysis completed", length=len(result))
        return result
    except Exception as e:
        logger.error("Analysis failed", error=str(e))
        raise ExternalAPIError(f"NVIDIA API failed: {str(e)}") from e


@retry_with_backoff(max_retries=3, exceptions=(requests.RequestException,))
def generate_pedagogical_score(analysis: str, transcript: str, syllabus: str = "") -> dict:
    """
    Generate pedagogical quality score (0-100) based on analysis.
    
    Args:
        analysis: Pedagogical analysis text
        transcript: Original transcript for content alignment check
        syllabus: Optional syllabus for curriculum alignment scoring
    
    Returns:
        dict with 'score' (int) and 'reasoning' (str)
    """
    if not analysis or len(analysis.strip()) == 0:
        raise ValueError("Analysis cannot be empty")
    
    syllabus_scoring = ""
    if syllabus and len(syllabus.strip()) > 0:
        syllabus_scoring = f"""

SYLLABUS/CURRICULUM CONTEXT:
{syllabus}

CURRICULUM ALIGNMENT (Additional 20 points available):
- Compare the transcript content against the syllabus
- Award points for topics covered that match syllabus objectives
- Award points for depth and accuracy of coverage
- Deduct points for major syllabus topics that were skipped
- Award 0-20 points based on how well the lecture aligns with curriculum goals

TRANSCRIPT CONTENT (for syllabus comparison):
{transcript[:3000]}...
"""
    
    prompt = f"""
You are an educational assessment expert.

Based on the pedagogical analysis below, provide a quality score from 0-100.

Scoring criteria:

**Teaching Methodology (80 points):**
- Question frequency (0-35 points): 
  * 2-4 questions per 10 min = 30-35 points
  * 1-2 questions per 10 min = 20-25 points  
  * 0-1 questions = 10-15 points
  * No questions = 5-10 points (content delivery only)

- Wait time (0-20 points):
  * >3 seconds = 18-20 points (optimal)
  * 1-3 seconds = 10-15 points
  * <1 second = 5 points
  * N/A when no questions = 10 points (neutral)

- Student participation (0-20 points):
  * 30-50% student voice = 18-20 points (optimal)
  * 10-30% = 10-15 points
  * 0-10% = 5-8 points
  * Pure lecture = 5 points (base for content delivery)

- Cultural engagement (0-5 points):
  * Code-switching present = 5 points
  * None detected = 2-3 points{syllabus_scoring}

IMPORTANT GUIDELINES:
- Be fair and realistic
- Content delivery alone deserves 30-40 points minimum
- Consider the lecture style and context
- If syllabus is provided, use it to assess content coverage and alignment
- Provide specific, actionable feedback

PEDAGOGICAL ANALYSIS:
{analysis}

Output ONLY in this exact JSON format:
{{
  "score": <number 0-100>,
  "reasoning": "<2-3 sentences explaining the score with specific details>"
}}

Example with syllabus:
{{
  "score": 68,
  "reasoning": "The lecture covered 3 out of 5 key syllabus topics with good depth. Teaching methodology showed moderate interaction with 2 questions per 10 minutes, but student participation remained limited at around 15%. Cultural engagement was minimal with no code-switching observed."
}}

Example without syllabus:
{{
  "score": 45,
  "reasoning": "Traditional lecture format with content delivery but no interactive elements. No questions were posed and student participation was absent. The session would benefit from incorporating questioning techniques and wait time to encourage engagement."
}}"""

    def _call_nvidia_api():
        response = requests.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Accept": "application/json"
            },
            json={
                "model": "meta/llama-4-maverick-17b-128e-instruct",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
                "max_tokens": 200
            },
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
    
    try:
        logger.info("Generating pedagogical score")
        result = nvidia_circuit_breaker.call(_call_nvidia_api)
        
        # Parse JSON response
        import json
        # Extract JSON if wrapped in markdown code blocks
        if "```json" in result:
            result = result.split("```json")[1].split("```")[0].strip()
        elif "```" in result:
            result = result.split("```")[1].split("```")[0].strip()
        
        score_data = json.loads(result)
        logger.info("Scoring completed", score=score_data.get("score"))
        return score_data
    except json.JSONDecodeError as e:
        logger.error("Failed to parse score JSON", error=str(e))
        # Fallback: extract number from text
        import re
        numbers = re.findall(r'\b\d+\b', result)
        if numbers:
            return {"score": int(numbers[0]), "reasoning": "Score extracted from response"}
        return {"score": 50, "reasoning": "Unable to generate score"}
    except Exception as e:
        logger.error("Scoring failed", error=str(e))
        raise ExternalAPIError(f"NVIDIA API scoring failed: {str(e)}") from e


@retry_with_backoff(max_retries=3, exceptions=(requests.RequestException,))
def extract_pedagogical_metrics(analysis: str, transcript: str) -> dict:
    """
    Extract 5 structured Rosenshine metrics from the analysis and transcript.
    
    Returns:
        dict with review_ratio, question_velocity, wait_time,
        teacher_talking_time, hinglish_fluency
    """
    if not analysis or len(analysis.strip()) == 0:
        raise ValueError("Analysis cannot be empty")

    prompt = f"""You are an educational metrics extraction engine.

From the pedagogical analysis and transcript below, extract these 5 numeric metrics.
Be precise — use evidence from the text to estimate each value.

METRICS TO EXTRACT:
1. review_ratio (0-100): Percentage of first 5-8 minutes that contains review keywords/concepts from a previous lecture. If no review is detected, use 0-20. If strong review is present, use 70-100.
2. question_velocity (0-15): Number of questions asked by the teacher per 10 minutes. Count explicit questions mentioned in the analysis.
3. wait_time (0-10): Average seconds of silence after a teacher question. Use the analysis text for clues. If not mentioned, estimate 1-2 seconds.
4. teacher_talking_time (0-100): Percentage of total speaking time that is the teacher's voice. If "monologue" or "100%", use 90-100. If "interactive", use 50-70.
5. hinglish_fluency (0-100): How accurately Hindi-English code-switching is captured. If code-switching is present and noted, 70-100. If none detected, 30-50.

PEDAGOGICAL ANALYSIS:
{analysis}

TRANSCRIPT (first 2000 chars):
{transcript[:2000]}

Output ONLY valid JSON:
{{
  "review_ratio": <number>,
  "question_velocity": <number>,
  "wait_time": <number>,
  "teacher_talking_time": <number>,
  "hinglish_fluency": <number>
}}"""

    def _call_nvidia_api():
        response = requests.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Accept": "application/json"
            },
            json={
                "model": "meta/llama-4-maverick-17b-128e-instruct",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,
                "max_tokens": 200
            },
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()

    try:
        logger.info("Extracting pedagogical metrics")
        result = nvidia_circuit_breaker.call(_call_nvidia_api)

        import json
        if "```json" in result:
            result = result.split("```json")[1].split("```")[0].strip()
        elif "```" in result:
            result = result.split("```")[1].split("```")[0].strip()

        metrics = json.loads(result)
        # Clamp values to expected ranges
        metrics["review_ratio"] = max(0, min(100, float(metrics.get("review_ratio", 50))))
        metrics["question_velocity"] = max(0, min(15, float(metrics.get("question_velocity", 3))))
        metrics["wait_time"] = max(0, min(10, float(metrics.get("wait_time", 2))))
        metrics["teacher_talking_time"] = max(0, min(100, float(metrics.get("teacher_talking_time", 70))))
        metrics["hinglish_fluency"] = max(0, min(100, float(metrics.get("hinglish_fluency", 50))))

        logger.info("Metrics extracted", metrics=metrics)
        return metrics
    except json.JSONDecodeError as e:
        logger.error("Failed to parse metrics JSON", error=str(e))
        return {
            "review_ratio": 50.0,
            "question_velocity": 3.0,
            "wait_time": 2.0,
            "teacher_talking_time": 70.0,
            "hinglish_fluency": 50.0
        }
    except Exception as e:
        logger.error("Metrics extraction failed", error=str(e))
        raise ExternalAPIError(f"NVIDIA API metrics extraction failed: {str(e)}") from e
