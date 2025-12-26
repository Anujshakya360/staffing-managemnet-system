
export const SQL_SCHEMA = `
-- =============================================
-- PROSTAFF HACKATHON DATABASE SCHEMA
-- =============================================

CREATE TABLE Clients (
    ClientId INT PRIMARY KEY IDENTITY(1,1),
    ClientName NVARCHAR(200) NOT NULL,
    Industry NVARCHAR(100),
    CreatedDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE JobOrders (
    JobOrderId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT FOREIGN KEY REFERENCES Clients(ClientId),
    JobTitle NVARCHAR(200) NOT NULL,
    RequiredSkills NVARCHAR(MAX), -- Stored as JSON array
    JobLocation NVARCHAR(200),
    PayRate DECIMAL(18,2),
    StartDate DATE,
    EndDate DATE,
    JobStatus NVARCHAR(50) DEFAULT 'OPEN',
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE Candidates (
    CandidateId INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(200) NOT NULL,
    Skills NVARCHAR(MAX),
    Email NVARCHAR(200),
    CreatedDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE JobAssignments (
    AssignmentId INT PRIMARY KEY IDENTITY(1,1),
    JobOrderId INT FOREIGN KEY REFERENCES JobOrders(JobOrderId),
    CandidateId INT FOREIGN KEY REFERENCES Candidates(CandidateId),
    AssignedDate DATETIME DEFAULT GETDATE(),
    AssignmentStatus NVARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE Timesheets (
    TimesheetId INT PRIMARY KEY IDENTITY(1,1),
    AssignmentId INT FOREIGN KEY REFERENCES JobAssignments(AssignmentId),
    WorkDate DATE,
    HoursWorked DECIMAL(5,2),
    Description NVARCHAR(MAX),
    Status NVARCHAR(50) DEFAULT 'SUBMITTED', -- SUBMITTED, APPROVED, REJECTED, PAYROLL_READY
    CreatedDate DATETIME DEFAULT GETDATE()
);
`;

export const SQL_STORED_PROCEDURES = `
-- =============================================
-- PROSTAFF STORED PROCEDURES (JSON IN/OUT)
-- =============================================

-- CREATE JOB ORDER
CREATE PROCEDURE sp_CreateJobOrder
    @JsonInput NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO JobOrders (ClientId, JobTitle, RequiredSkills, JobLocation, PayRate, StartDate, EndDate)
        SELECT ClientId, JobTitle, RequiredSkills, JobLocation, PayRate, StartDate, EndDate
        FROM OPENJSON(@JsonInput)
        WITH (
            ClientId INT,
            JobTitle NVARCHAR(200),
            RequiredSkills NVARCHAR(MAX) AS JSON,
            JobLocation NVARCHAR(200),
            PayRate DECIMAL(18,2),
            StartDate DATE,
            EndDate DATE
        );

        SELECT 200 AS StatusCode, 'Job Order Created Successfully' AS Message
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END TRY
    BEGIN CATCH
        SELECT 500 AS StatusCode, ERROR_MESSAGE() AS Message
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END CATCH
END;

-- ASSIGN CANDIDATE
CREATE PROCEDURE sp_AssignCandidateToJob
    @JsonInput NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @JobId INT, @CandidateId INT;
    
    SELECT @JobId = JobId, @CandidateId = CandidateId 
    FROM OPENJSON(@JsonInput) WITH (JobId INT, CandidateId INT);

    IF EXISTS (SELECT 1 FROM JobAssignments WHERE JobOrderId = @JobId AND CandidateId = @CandidateId)
    BEGIN
        SELECT 400 AS StatusCode, 'Candidate already assigned to this job' AS Message FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
        RETURN;
    END

    INSERT INTO JobAssignments (JobOrderId, CandidateId) VALUES (@JobId, @CandidateId);
    
    SELECT 200 AS StatusCode, 'Candidate Assigned Successfully' AS Message FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
END;
`;

export const DOTNET_API_CODE = `
// =============================================
// PROSTAFF ASP.NET CORE WEB API CONTROLLER
// =============================================

[ApiController]
[Route("api/[controller]")]
public class StaffingController : ControllerBase
{
    private readonly string _connectionString;

    public StaffingController(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection");
    }

    [HttpPost("joborders/create")]
    public async Task<IActionResult> CreateJobOrder([FromBody] object jobOrder)
    {
        using var connection = new SqlConnection(_connectionString);
        var jsonParam = JsonSerializer.Serialize(jobOrder);
        
        var result = await connection.QuerySingleOrDefaultAsync<string>(
            "sp_CreateJobOrder", 
            new { JsonInput = jsonParam }, 
            commandType: CommandType.StoredProcedure
        );

        return Ok(JsonDocument.Parse(result));
    }

    [HttpPost("timesheets/approve")]
    public async Task<IActionResult> ApproveTimesheet([FromBody] object approvalData)
    {
        using var connection = new SqlConnection(_connectionString);
        var jsonParam = JsonSerializer.Serialize(approvalData);

        var result = await connection.QuerySingleOrDefaultAsync<string>(
            "sp_ApproveTimesheet", 
            new { JsonInput = jsonParam }, 
            commandType: CommandType.StoredProcedure
        );

        return Ok(JsonDocument.Parse(result));
    }
}
`;
