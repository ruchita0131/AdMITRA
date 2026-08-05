package com.admitra.controller;

import com.admitra.dto.ApiResponse;
import com.admitra.dto.CampaignCreateRequest;
import com.admitra.dto.CampaignDto;
import com.admitra.service.CampaignService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping("/campaigns")
    public ResponseEntity<List<CampaignDto>> getCampaigns(Authentication authentication) {
        return ResponseEntity.ok(campaignService.getCampaignsByUser(authentication.getName()));
    }
    
    @GetMapping("/campaigns/all")
    public ResponseEntity<List<CampaignDto>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @PostMapping("/campaign")
    public ResponseEntity<CampaignDto> createCampaign(@Valid @RequestBody CampaignCreateRequest request, Authentication authentication) {
        return new ResponseEntity<>(campaignService.createCampaign(request, authentication.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/campaign/{id}")
    public ResponseEntity<CampaignDto> updateCampaign(@PathVariable Long id, @Valid @RequestBody CampaignCreateRequest request) {
        return ResponseEntity.ok(campaignService.updateCampaign(id, request));
    }

    @DeleteMapping("/campaign/{id}")
    public ResponseEntity<ApiResponse> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok(new ApiResponse(true, "Campaign deleted successfully"));
    }

    @PatchMapping("/campaign/{id}/pause")
    public ResponseEntity<CampaignDto> pauseCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.pauseCampaign(id));
    }

    @PatchMapping("/campaign/{id}/resume")
    public ResponseEntity<CampaignDto> resumeCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.resumeCampaign(id));
    }
}
