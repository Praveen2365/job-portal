package com.jobportal.service;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class JobApplicationService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobApplicationRepository applicationRepository;

    public JobApplicationService(JobRepository jobRepository,
                                 UserRepository userRepository,
                                 JobApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    public String applyJob(Long jobId,
                           String userEmail,
                           MultipartFile resume) throws IOException {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent duplicate apply
        if (applicationRepository.existsByJobIdAndUserId(job.getId(), user.getId())) {
            return "You already applied for this job!";
        }

        // Create uploads folder
        String uploadDir = "uploads/";
        File folder = new File(uploadDir);
        if (!folder.exists()) folder.mkdir();

        // Save resume
        String fileName = System.currentTimeMillis()
                + "_" + resume.getOriginalFilename();

        resume.transferTo(new File(uploadDir + fileName));

        // Save application
        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setUser(user);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setResumeFileName(fileName);

        applicationRepository.save(application);

        return "Job Applied Successfully!";
    }
}
