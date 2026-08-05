package com.admitra.controller;

import com.admitra.dto.AnalyticsDto;
import com.admitra.dto.CampaignPerformanceDto;
import com.admitra.dto.DashboardSummaryDto;
import com.admitra.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/campaign/{id}")
    public ResponseEntity<List<AnalyticsDto>> getCampaignAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.getCampaignAnalytics(id));
    }

    @GetMapping("/top")
    public ResponseEntity<List<CampaignPerformanceDto>> getTopCampaigns() {
        return ResponseEntity.ok(analyticsService.getTopCampaigns());
    }
}
