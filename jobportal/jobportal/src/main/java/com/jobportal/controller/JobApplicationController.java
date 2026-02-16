package com.jobportal.controller;

import com.jobportal.service.JobApplicationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @PostMapping("/apply")
    public String applyJob(
            @RequestParam Long jobId,
            @RequestParam String userEmail,
            @RequestParam MultipartFile resume
    ) throws Exception {

        return service.applyJob(jobId, userEmail, resume);
    }
}
