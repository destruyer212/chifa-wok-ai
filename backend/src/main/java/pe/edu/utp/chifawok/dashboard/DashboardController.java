package pe.edu.utp.chifawok.dashboard;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.utp.chifawok.dashboard.DashboardDtos.DashboardDTO;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard")
@PreAuthorize("isAuthenticated()")
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/resumen")
    public DashboardDTO resumen() { return service.resumen(); }
}
